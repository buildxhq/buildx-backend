// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { logActivity } from '@/lib/logActivity'; // ✅
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email';
import { rateLimiter } from '@/lib/middleware/rateLimiter';
import type { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimiter({ windowSec: 60, max: 5 });
    await limit(req);

    const {
      email, password, role, planTier, inviteToken,
      firstName, lastName, phone, fax, address,
      companyName, companyAddress, website, businessType,
      certifications = [], laborAffiliations = [], regions = [], trades = []
    } = await req.json();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.' }, { status: 400 });
    }

    const assignedPlan = businessType === 'Subcontractor' ? 'sub_free' : null;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ message: 'User already exists' }, { status: 400 });

    let linkedInvite = null;
    if (inviteToken) {
      linkedInvite = await db.invite.findUnique({ where: { token: inviteToken } });
      if (!linkedInvite || linkedInvite.status === 'registered') {
        return NextResponse.json({ message: 'Invalid or expired invite token.' }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    let company = null;
    if (companyName) {
      company = await db.company.upsert({
        where: { name: companyName },
        update: { address: companyAddress, website },
        create: { name: companyName, address: companyAddress, website }
      });
    }

    let inferredRole = 'sub';
    if (businessType === 'General Contractor') inferredRole = 'gc';
    else if (businessType === 'Architect / Engineer') inferredRole = 'ae';

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: inferredRole as Role,
        planTier: assignedPlan,
        name: linkedInvite?.name || `${firstName} ${lastName}`,
        phone: linkedInvite?.phone || phone,
        certifications,
        laborAffiliations,
        regions,
        companyId: company?.id || null,
        verificationToken,
        tokenExpires
      }
    });

    if (planTier === 'sub_free') {
      await sendVerificationEmail(user.email, user.verificationToken);
    }

    if (linkedInvite) {
      await db.invite.update({
        where: { token: inviteToken },
        data: {
          status: 'registered',
          acceptedAt: new Date(),
          recipient: {
            connect: { id: user.id }
        },
      }
    });
   }

    for (const tradeName of trades) {
      const trade = await db.trade.findUnique({ where: { name: tradeName } });
      if (trade) {
        await db.userTrade.create({
          data: {
            userId: user.id,
            tradeId: trade.id
          }
        });
        await logActivity(user.id, 'TRADE_LINKED', trade.division, trade.id);
      }
    }

    await logActivity(user.id, 'Signed Up', linkedInvite ? 'Joined via Project Invite' : 'Signed up directly');
    await sendWelcomeEmail(user.email, user.name);
    await logActivity(user.id, 'PLAN_ASSIGNED', assignedPlan);

    const token = jwt.sign(
      { id: user.id, role: user.role, planTier: user.planTier },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      token,
      role: user.role,
      planTier: user.planTier,
      message: 'Signup successful — please check your email to verify your account.'
    });
  } catch (error: any) {
    console.error('❌ Registration Error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

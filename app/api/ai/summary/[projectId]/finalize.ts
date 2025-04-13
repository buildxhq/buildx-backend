// /app/api/ai/summary/[projectId]/finalize.ts — AI Post-Award Smart Summary

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { summarizeProjectAward } from '@/lib/ai/postAwardEngine';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const project = await db.project.findUnique({
      where: { id: params.projectId },
      include: {
        bids: {
          include: {
            subcontractor: {
              select: {
                id: true,
                name: true,
                email: true,
                planTier: true,
              }
            }
          }
        },
        quotes: {
          include: {
            supplier: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    planTier: true,
                    verified: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!project || project.userId !== user.id.toString()) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 🔁 Flatten supplier.user into supplier
    const flattenedQuotes = project.quotes.map((quote) => ({
      ...quote,
      supplier: {
        id: quote.supplier.user.id,
        name: quote.supplier.user.name,
        email: quote.supplier.user.email,
        planTier: quote.supplier.user.planTier,
        verified: quote.supplier.user.verified
      }
    }));

    const summary = await summarizeProjectAward({
      ...project,
      quotes: flattenedQuotes
    });

    await db.aiPostAward.create({
      data: {
        projectId: project.id,
        userId: user.id.toString(),
        summaryReport: summary.text,
        nextSteps: summary.recommendations,
      },
    });

    await logActivity(user.id.toString(), 'AI_POST_AWARD_SUMMARY', 'Project', project.id);

    return NextResponse.json({
      message: 'Post-award summary complete',
      summary: summary.text,
      recommendations: summary.recommendations,
    });
  } catch (error) {
    console.error('[AI_POST_AWARD_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}


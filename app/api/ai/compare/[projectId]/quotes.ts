// /app/api/ai/compare/[projectId]/quotes.ts — AI Quote Comparison Engine

import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { runQuoteComparisonAI } from '@/lib/ai/quoteCompareEngine';
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
      return NextResponse.json({ error: 'Not your project' }, { status: 403 });
    }

    if (!project.quotes || project.quotes.length === 0) {
      return NextResponse.json({ error: 'No quotes to compare' }, { status: 400 });
    }

    if (!project.quotes || project.quotes.length === 0) {
  return NextResponse.json({ error: 'No quotes to compare' }, { status: 400 });
}

    const flattenedQuotes = project.quotes.map((quote) => ({
      ...quote,
      supplier: {
        id: quote.supplier.user.id,
        name: quote.supplier.user.name,
        email: quote.supplier.user.email,
        planTier: quote.supplier.user.planTier,
        verified: quote.supplier.user.verified,
      }
    }));

    const comparison = await runQuoteComparisonAI(flattenedQuotes);


    await logActivity(user.id.toString(), 'AI_QUOTE_COMPARISON_RAN', 'Project', project.id);

    return NextResponse.json({
      message: 'AI comparison complete',
      comparison,
    });
  } catch (error) {
    console.error('[AI_COMPARE_QUOTES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to compare quotes' }, { status: 500 });
  }
}

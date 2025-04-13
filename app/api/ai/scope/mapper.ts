// /app/api/ai/scope/mapper.ts — AI Spec-to-Scope Trade Mapper

import { verifyToken } from '@/lib/auth';
import { parseSpecsToScope } from '@/lib/ai/scopeMapperEngine';
import { logActivity } from '@/lib/logActivity';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user || !['gc', 'ae'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file') as File;
    if (!file || !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF spec files supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await parseSpecsToScope(buffer);

    await logActivity(user.id.toString(), 'AI_SCOPE_MAPPED_FROM_SPECS');

    return NextResponse.json({
      message: 'Spec-to-scope mapping complete',
      mappedTrades: result.mappedTrades,
      divisions: result.divisions,
    });
  } catch (error) {
    console.error('[SCOPE_MAPPER_ERROR]', error);
    return NextResponse.json({ error: 'Failed to parse specifications' }, { status: 500 });
  }
}

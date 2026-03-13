import { unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { filePath } = await req.json();

    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ error: 'filePath is required' }, { status: 400 });
    }

    // Prevent path traversal
    const normalized = path.normalize(filePath);
    if (!normalized.startsWith('uploads/projects/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), 'public', normalized);
    await unlink(fullPath);

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'file and projectId are required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}_${safeName}`;
    const relativePath = `uploads/projects/${projectId}`;
    const dir = path.join(process.cwd(), 'public', relativePath);

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fileName), buffer);

    const url = `/${relativePath}/${fileName}`;
    const storagePath = `${relativePath}/${fileName}`;

    return NextResponse.json({ url, path: storagePath });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

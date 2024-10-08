import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic'; // Necessary for handling dynamic requests

const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists
async function ensureUploadDir() {
  if (!(await fs.stat(uploadDir).catch(() => false))) {
    await fs.mkdir(uploadDir);
  }
}

export async function POST(req) {
  // Ensure the upload directory exists
  await ensureUploadDir();

  // Get the file data from the request
  const data = await req.formData();
  const file = data.get('documents'); // 'documents' is the name of the input field

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Define the file path where the uploaded file will be saved
  const filePath = path.join(uploadDir, file.name);

  // Read the file content as a Buffer and write it to the filesystem
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, fileBuffer);

  return NextResponse.json({ message: 'File uploaded successfully', filePath });
}

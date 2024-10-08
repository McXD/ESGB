import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define the directory where the uploaded files are stored
const uploadDir = path.join(process.cwd(), 'uploads');

export async function GET(req, { params }) {
  const { fileId } = params; // Extract fileId from the URL

  try {
    // Define the path to the file based on fileId
    const filePath = path.join(uploadDir, fileId);
    console.log(filePath);

    const fileExists = await fs.stat(filePath).catch(() => false);
    if (!fileExists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Return the file with appropriate headers for downloading
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileId}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}

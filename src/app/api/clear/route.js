import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function clearFolder(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    try {
      fs.unlinkSync(path.join(dirPath, file));
    } catch (err) {
      console.error(`Failed to delete ${file}:`, err);
    }
  });
}

export async function POST() {
  const base = path.join(process.cwd(), 'public');
  clearFolder(path.join(base, 'uploads'));
  clearFolder(path.join(base, 'converted'));

  return NextResponse.json({ success: true, message: 'Folders cleared' });
}
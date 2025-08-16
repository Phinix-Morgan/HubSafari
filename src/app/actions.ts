
'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function uploadImage(formData: FormData) {
  const file = formData.get('image') as File;
  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided.' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = join(process.cwd(), 'public/uploads');

  // Ensure the uploads directory exists
  if (!existsSync(uploadsDir)) {
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Could not create upload directory:', error);
      return { success: false, error: 'Failed to create upload directory.' };
    }
  }

  // Use a timestamp and the original file name to create a unique name
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  const path = join(uploadsDir, filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`Uploaded file to ${path}`);
    const imageUrl = `/uploads/${filename}`;
    return { success: true, imageUrl };
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: 'Failed to save the file.' };
  }
}

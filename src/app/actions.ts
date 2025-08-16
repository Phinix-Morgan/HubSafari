
'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(formData: FormData) {
  const file = formData.get('image') as File;
  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided.' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use a timestamp and the original file name to create a unique name
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  const path = join(process.cwd(), 'public/uploads', filename);
  
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

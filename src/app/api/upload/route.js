// //app/api/upload/route.js

// import { writeFile, mkdir, readdir, unlink } from 'fs/promises';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import mime from 'mime-types';
// import Jimp from 'jimp';

// const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
// const CONVERTED_DIR = path.join(process.cwd(), 'public', 'converted');

// // Ensure folders exist
// await mkdir(UPLOAD_DIR, { recursive: true });
// await mkdir(CONVERTED_DIR, { recursive: true });

// export async function POST(req) {
//   const formData = await req.formData();
//   const files = formData.getAll('images');

//   const outputFormat = formData.get('outputFormat');
//   const width = parseFloat(formData.get('width'));
//   const height = parseFloat(formData.get('height'));
//   const unit = formData.get('unit');
//   let quality = parseInt(formData.get('quality'), 10);

//   if (isNaN(quality) || quality < 10 || quality > 100) {
//     quality = 80;
//   }

//   let parsedWidth = width;
//   let parsedHeight = height;
//   const dpi = 96;

//   if (unit === 'cm') {
//     parsedWidth *= dpi / 2.54;
//     parsedHeight *= dpi / 2.54;
//   } else if (unit === 'in') {
//     parsedWidth *= dpi;
//     parsedHeight *= dpi;
//   }

//   const results = [];

//   try {
//     for (const file of files) {
//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       const ext = mime.extension(file.type) || 'jpg';
//       const filename = `${uuidv4()}.${ext}`;
//       const inputPath = path.join(UPLOAD_DIR, filename);

//       await writeFile(inputPath, buffer);

//       const uniqueName = `265img-${Date.now()}.${outputFormat}`;
//       const outputPath = path.join(CONVERTED_DIR, uniqueName);

//       let image = await Jimp.read(inputPath);

//       if (!isNaN(parsedWidth) && !isNaN(parsedHeight) && parsedWidth > 0 && parsedHeight > 0) {
//   image = image.resize(Math.round(parsedWidth), Math.round(parsedHeight), Jimp.RESIZE_BEZIER);
// }

//       // Apply quality setting only for supported formats
// if (outputFormat === 'jpeg' || outputFormat === 'jpg' || outputFormat === 'webp') {
//   image.quality(quality);
// }

// switch (outputFormat) {
//   case 'jpeg':
//   case 'jpg':
//   case 'png':
//   case 'bmp':
//   case 'webp':
//     await image.writeAsync(outputPath);
//     break;
// }

//       results.push({
//         original: file.name,
//         converted: uniqueName,
//         url: `/converted/${uniqueName}`
//       });
//     }
    

//     return Response.json({ success: true, results });
//   } catch (err) {
//     console.error(err);
//     return Response.json({ success: false, message: 'Conversion error' }, { status: 500 });
//   }
// }


import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';


const CLEANUP_MAX_AGE = 5 * 60 * 1000; // 5 minutes in ms
async function cleanOldFiles(dir) {
  const files = await readdir(dir);
  const now = Date.now();

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const { birthtimeMs } = await stat(filePath);
      if (now - birthtimeMs > CLEANUP_MAX_AGE) {
        await unlink(filePath);
        console.log(`Deleted old file: ${filePath}`);
      }
    } catch (err) {
      console.warn(`Error deleting file ${filePath}:`, err);
    }
  }
}

const UPLOAD_DIR = path.join(process.cwd(),'public', 'uploads');
const CONVERTED_DIR = path.join(process.cwd(), 'public', 'converted');

await mkdir(UPLOAD_DIR, { recursive: true });
await mkdir(CONVERTED_DIR, { recursive: true });

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll('images');

  const outputFormat = formData.get('outputFormat');
  const width = parseFloat(formData.get('width'));
  const height = parseFloat(formData.get('height'));
  const unit = formData.get('unit');
  let quality = parseInt(formData.get('quality'), 10);
  
await cleanOldFiles(UPLOAD_DIR);
await cleanOldFiles(CONVERTED_DIR);

  if (isNaN(quality) || quality < 10 || quality > 100) {
    quality = 80;
  }

  // DPI conversion
  const dpi = 96;
  let parsedWidth = width;
  let parsedHeight = height;
  if (unit === 'cm') {
    parsedWidth *= dpi / 2.54;
    parsedHeight *= dpi / 2.54;
  } else if (unit === 'in') {
    parsedWidth *= dpi;
    parsedHeight *= dpi;
  }

  const results = [];

  try {
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = mime.extension(file.type) || 'jpg';
      const filename = `${uuidv4()}.${ext}`;
      const inputPath = path.join(UPLOAD_DIR, filename);

      await writeFile(inputPath, buffer);

      const uniqueName = `265img-${Date.now()}.${outputFormat}`;
      const outputPath = path.join(CONVERTED_DIR, uniqueName);

      let transformer = sharp(buffer);

      if (!isNaN(parsedWidth) && !isNaN(parsedHeight) && parsedWidth > 0 && parsedHeight > 0) {
        transformer = transformer.resize(Math.round(parsedWidth), Math.round(parsedHeight), {
          fit: 'contain',
          withoutEnlargement: true
        });
      }

      switch (outputFormat) {
        case 'jpeg':
        case 'jpg':
          transformer = transformer.jpeg({ quality });
          break;
        case 'png':
          transformer = transformer.png({ quality });
          break;
        case 'webp':
          transformer = transformer.webp({ quality });
          break;
        case 'tiff':
          transformer = transformer.tiff({ quality });
          break;
        case 'bmp':
          transformer = transformer.bmp();
          break;
        case 'avif':
          transformer = transformer.avif({ quality });
          break;
        default:
          return Response.json({
            success: false,
            message: `Unsupported format: ${outputFormat}`
          }, { status: 400 });
      }

      await transformer.toFile(outputPath);

      results.push({
        original: file.name,
        converted: uniqueName,
        url: `/converted/${uniqueName}`
      });
    }

    return Response.json({ success: true, results });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: 'Conversion error' }, { status: 500 });
  }
}
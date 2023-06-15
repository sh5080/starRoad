import sharp from 'sharp';
import path from 'path';

export const compressImage = async (
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<void> => {
  try {
    const format = path.extname(inputPath).slice(1);

    const image = sharp(inputPath).resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    switch (format) {
      case 'jpeg':
        await image.jpeg({ quality: 80 }).toFile(outputPath);
        break;
      case 'jpg':
        await image.jpeg({ quality: 80 }).toFile(outputPath);
        break;
      case 'png':
        await image.png({ quality: 80 }).toFile(outputPath);
        break;
      default:
        console.log(`Unsupported image format: ${format}`);
    }
  } catch (error) {
    console.error('Error compressing image', error);
  }
};

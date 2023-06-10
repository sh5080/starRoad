import sharp from 'sharp';
import * as fs from 'node:fs';

const compressImage = async (inputPath: string, outputPath: string, width: number, height: number): Promise<void> => {
  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 }) // you can adjust the compression quality here
      .toFile(outputPath);

    console.log(`Image compressed and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error compressing image', error);
  }
};

// Usage:
compressImage('./input.jpg', './output.jpg', 800, 800);

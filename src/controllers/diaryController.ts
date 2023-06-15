import { Request, Response, NextFunction } from 'express';
import * as diaryService from '../services/diaryService';
import { AppError, CommonError } from '../types/AppError';
import { CustomRequest } from '../types/customRequest';
import * as fs from 'node:fs/promises';
import { compressImage } from '../util/compressImage';
import config from '../config';
import path from 'node:path';
const IMG_PATH = config.server.IMG_PATH;

/** 여행기 작성 */
export const createDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    let imgNames: string[] = [];


    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];

      const promises = files.map(async (file) => {
        const inputPath = path.join(__dirname, '../../public', file.filename);
        const compressedPath = path.join(__dirname, '../../public/compressed', file.filename);
        await compressImage(inputPath, compressedPath, 600, 600);

        const compressedFilename = path.basename(compressedPath);
        const encodedFilename = encodeURIComponent(compressedFilename);
        imgNames.push(`${IMG_PATH}/${encodedFilename}`);

        await fs.unlink(path.join(__dirname, '../../public', file.filename));
        console.log('오리지널 이미지 삭제 완료');
      });
      await Promise.all(promises);
    }

    const { title, content } = req.body;

    const { planId } = req.params;
    const username = req.user?.username;

    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    if (!title || !content) {
      throw new AppError(CommonError.INVALID_INPUT, '제목, 본문은 필수 입력 항목입니다.', 400);
    }

    const diary = await diaryService.createDiary(
      { username, title, content, image: imgNames },
      username,
      Number(planId)
    );

    res.status(201).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 전체 여행기 조회 */
export const getAllDiaries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diary = await diaryService.getAllDiaries();
    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '전체 여행기를 찾을 수 없습니다.', 404);
    }
    res.status(200).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 내 여행기 조회 */
export const getMyDiaries = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const username = req.user?.username;
    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    const diaries = await diaryService.getMyDiaries(username);
    res.status(200).json(diaries);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 특정 여행기 조회 */
export const getOneDiaryByDiaryId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diaryId = parseInt(req.params.diaryId, 10);
    const diary = await diaryService.getOneDiaryByDiaryId(diaryId);

    if (!diary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }
    res.status(200).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 여행기 수정 */
export const updateDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const diaryId = parseInt(String(req.params.diaryId), 10);
    const { title, content } = req.body;
    const username = req.user?.username;

    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    if (!title || !content) {
      throw new AppError(CommonError.INVALID_INPUT, '제목과 본문은 필수 입력 항목입니다.', 400);
    }

    // Get existing diary
    const existingDiary = await diaryService.getOneDiaryByDiaryId(diaryId);
    if (!existingDiary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '해당 다이어리를 찾을 수 없습니다.', 404);
    }

    // Delete existing images
    if (existingDiary.image) {
      let imageArray: string[];

      if (typeof existingDiary.image === 'string') {
        try {
          imageArray = JSON.parse(existingDiary.image);
          if (!Array.isArray(imageArray)) {
            throw new Error();
          }
        } catch {
          imageArray = [existingDiary.image];
        }
      } else {
        imageArray = existingDiary.image;
      }

      console.log(imageArray);
      for (const imageName of imageArray) {
        const url = new URL(imageName);
        const pathname = url.pathname;
        const baseDir = '/static/compressed/';
        const start = pathname.indexOf(baseDir);
        if (start === -1) {
          throw new AppError(CommonError.UNEXPECTED_ERROR, 'Unexpected file path', 500);
        }
        const encodedFilename = pathname.substring(start + baseDir.length);
        const filename = decodeURIComponent(encodedFilename);

        if (filename) {
          try {
            console.log('@@@@@@@@@@@@@@@@@filename@@@@@@@@@@@@@@@@', filename);
            await fs.unlink(path.join(__dirname, '../../public/compressed', filename));
            console.log('Deleted existing image');
          } catch (err) {
            console.error(`Failed to delete image at ${imageName}: `, err);
            throw new AppError(CommonError.UNEXPECTED_ERROR, 'Failed to delete image', 500);
          }
        }
      }
    }

    let imgNames: string[] = [];

    // Upload new images and compress
    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];

      const promises = files.map(async (file) => {
        const inputPath = path.join(__dirname, '../../public', file.filename);
        const compressedPath = path.join(__dirname, '../../public/compressed', file.filename);
        await compressImage(inputPath, compressedPath, 600, 600);

        // Save the compressed image filename to the array
        const compressedFilename = path.basename(compressedPath);
        imgNames.push(`${IMG_PATH}/${compressedFilename}`);

        await fs.unlink(inputPath);
        console.log('Original image deleted');
      });
      await Promise.all(promises);
    }

    // Update the diary
    const diaryData = { title, content, image: JSON.stringify(imgNames) };
    await diaryService.updateDiary(diaryData, diaryId, username);

    res.status(200).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 여행기 삭제 */
export const deleteDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const diaryId = parseInt(String(req.params.diaryId), 10);
    const username = req.user?.username;
    if (!username) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '사용자 정보를 찾을 수 없습니다.', 401);
    }
    const deletedDiary = await diaryService.deleteDiary(diaryId, username);

    if (!deletedDiary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '나의 여행기가 아닙니다.', 404);
    }
    if (deletedDiary.image && typeof deletedDiary.image === 'string') {
      // Parsing image URLs
      const imgURLs = JSON.parse(deletedDiary.image);

      const promises = imgURLs.map(async (url: string) => {
        const imgName = url.split('/compressed')[1];

        const filePath = path.join(__dirname, '../../public/compressed', imgName);
        return await fs.unlink(filePath);
      });

      await Promise.all(promises);
    }
    console.log('이미지 삭제 성공');

    res.status(200).json(deletedDiary);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

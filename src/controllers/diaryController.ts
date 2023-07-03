import { Request, Response, NextFunction } from 'express';
import * as diaryService from '../services/diaryService';
import { AppError, CommonError } from '../types/AppError';
import { CustomRequest } from '../types/customRequest';
import * as fs from 'node:fs/promises';
import { compressImage } from '../util/compressImage';
import config from '../config';
import path from 'node:path';
import docs from '../types/controller';
const IMG_PATH = config.server.IMG_PATH;

/** 여행기 작성 */

export const checkAuthorization:typeof docs.checkAuthorization = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.params;
    const username = req.user?.username!;

    const plan = await diaryService.getPlanByIdAndUsername(Number(planId), username);
    if (plan?.username === undefined) {
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '사용자에게 권한이 없습니다.', 403);
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 여행기 작성 */
export const createDiary:typeof docs.createDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    const { planId } = req.params;
    const username = req.user?.username!;

    let imgNames: string[] = [];
    if (!req.files) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '이미지 파일이 첨부되지 않았습니다.', 400);
    }
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      const promises = files.map(async (file) => {
        const inputPath = path.join(__dirname, '../../public', file.filename);
        const compressedPath = path.join(__dirname, '../../public/compressed', file.filename);

        await compressImage(inputPath, compressedPath, 600, 600);

        const compressedFilename = path.basename(compressedPath);
        const encodedFilename = encodeURIComponent(compressedFilename);

        imgNames.push(`${IMG_PATH}/${encodedFilename}`);

        await fs.unlink(inputPath);
      });
      await Promise.all(promises);
    }
    const plan = await diaryService.getPlanByIdAndUsername(Number(planId), username);
    const diaryData = await diaryService.createDiary({ username, title, content, image: imgNames }, plan!);

    res.status(201).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 전체 여행기 조회 */
export const getAllDiaries:typeof docs.getAllDiaries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diaryData = await diaryService.getAllDiaries();
    if (!diaryData) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '전체 여행기를 찾을 수 없습니다.', 404);
    }
    res.status(200).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 내 여행기 조회 */
export const getMyDiaries:typeof docs.getMyDiaries = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const username = req.user?.username!;
    const diaryData = await diaryService.getMyDiaries(username);
    if (!diaryData[0]) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기가 없습니다.', 404);
    }
    res.status(200).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 특정 여행기 조회 */
export const getOneDiaryByDiaryId:typeof docs.getOneDiaryByDiaryId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diaryId = parseInt(req.params.diaryId, 10);
    const diaryData = await diaryService.getOneDiaryByDiaryId(diaryId);
    if (!diaryData) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '해당 여행기를 찾을 수 없습니다.', 404);
    }
    res.status(200).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const checkAuthorizationForUpdate:typeof docs.checkAuthorizationForUpdate = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { diaryId } = req.params;
    const username = req.user?.username!;

    const originDiary = await diaryService.getOneDiaryByDiaryId(Number(diaryId));
    if(originDiary.username !== username){
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '사용자에게 권한이 없습니다.', 403);
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
/** 여행기 수정 */
export const updateDiary:typeof docs.updateDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const diaryId = parseInt(String(req.params.diaryId), 10);
    const { title, content } = req.body;
    const username = req.user?.username!;
    const originDiary = await diaryService.getOneDiaryByDiaryId(diaryId);
    if (!originDiary) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '해당 여행기를 찾을 수 없습니다.', 404);
    }
    if (originDiary.image) {
      let imageArray: string[];

      if (typeof originDiary.image === 'string') {
        try {
          imageArray = JSON.parse(originDiary.image);
          if (!Array.isArray(imageArray)) {
            throw new Error();
          }
        } catch {
          imageArray = [originDiary.image];
        }
      } else {
        imageArray = originDiary.image;
      }

      for (const imageName of imageArray) {
        const url = new URL(imageName);
        const pathname = url.pathname;
        const baseDir = '/public/compressed/';
        const start = pathname.indexOf(baseDir);
        if (start === -1) {
          console.log('Failed to detect image:', imageName);
          continue;
        }
        const encodedFilename = pathname.substring(start + baseDir.length);
        const filename = decodeURIComponent(encodedFilename);

        if (filename) {
          try {
            await fs.unlink(path.join(__dirname, '../../public/compressed', filename));
          } catch (err) {
            console.error(`Failed to delete image at ${imageName}: `, err);
            throw new AppError(CommonError.UNEXPECTED_ERROR, 'Failed to delete image', 500);
          }
        }
      }
    }

    let imgNames: string[] = [];

    if (req.files) {
      const files = req.files as Express.Multer.File[];

      const promises = files.map(async (file) => {
        const inputPath = path.join(__dirname, '../../public', file.filename);
        const compressedPath = path.join(__dirname, '../../public/compressed', file.filename);

        await compressImage(inputPath, compressedPath, 600, 600);

        const compressedFilename = path.basename(compressedPath);

        imgNames.push(`${IMG_PATH}/${compressedFilename}`);

        await fs.unlink(inputPath);
      });
      await Promise.all(promises);
    }
    if(imgNames.length===0){
      throw new AppError(CommonError.INVALID_INPUT, '업로드하려는 파일이 유효하지 않습니다.', 400);
    }
    const diaryData = { title, content, image: JSON.stringify(imgNames) };
    await diaryService.updateDiary(diaryData, diaryId, username);

    res.status(200).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 여행기 삭제 */
export const deleteDiary: typeof docs.deleteDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const diaryId = parseInt(String(req.params.diaryId), 10);
    const username = req.user?.username!;

    const diaryData = await diaryService.deleteDiary(diaryId, username);
    if (diaryData.image && typeof diaryData.image === 'string') {
      const imgURLs = JSON.parse(diaryData.image);

      const promises = imgURLs.map(async (url: string) => {
        const encodedImgName = url.split('/compressed/')[1];
        const imgName = decodeURIComponent(encodedImgName);
        console.log(imgName);
        const filePath = path.join(__dirname, '../../public/compressed', imgName);
        return await fs.unlink(filePath);
      });

      await Promise.all(promises);
    }

    res.status(200).json(diaryData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

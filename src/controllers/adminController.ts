import { Response, NextFunction } from 'express';
import * as adminService from '../services/adminService';
import { CustomRequest } from '../types/customRequest';
import * as fs from 'node:fs/promises';
import { compressImage } from '../util/compressImage';
import config from '../config';
import path from 'node:path';
import { AppError, CommonError } from '../types/AppError';

const IMG_PATH = config.server.IMG_PATH;

/** [관리자] 모든 회원 조회하기 */
export const getAllUsers = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getAllUsers();
    if (!users) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '불러올 유저정보가 없습니다.', 400);
    }
    const userCount: number = users.length;
    res.status(200).json({ data: { users, userCount, message: '모든 회원을 불러왔습니다.' } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원 정보 수정하기 */
export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { username, name, email, role } = req.body;
    const userInfo = { username, name, email, role };
    const data = await adminService.updateUser(Number(id), userInfo);
    res.status(201).json({ data, message: '회원 정보 수정을 완료했습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원 삭제하기 */
export const deleteUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const message = await adminService.deleteUser(Number(id));
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원이 작성한 여행 일정 조회하기 */
export const getAllTravelPlansByUsername = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const userTravelInfos = await adminService.getAllTravelPlansByUsername(String(username));
    res.status(200).json({ data: userTravelInfos, message: '회원이 작성한 여행 일정을 조회했습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원이 작성한 날짜 장소 조회하기 */
export const getAllLocationsByPlanId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.params;

    const userTravelLocationInfos = await adminService.getAllLocationsByPlanId(Number(planId));

    res.status(200).json({ data: userTravelLocationInfos, message: '회원이 작성한 날짜별 장소를 조회했습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원이 작성한 다이어리 모두 조회하기 */
export const getAllDiariesByUsername = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const userTravelDiaryInfos = await adminService.getAllDiariesByUsername(String(username));

    res.status(200).json({ data: userTravelDiaryInfos, message: '회원이 작성한 다이어리를 조회했습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원이 작성한 다이어리 삭제하기 */
export const deleteDiaryByUsernameAndDiaryId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, planId } = req.params;
    const message = await adminService.deleteDiaryByUsernameAndDiaryId(String(username), Number(planId));
    res.status(200).json({ data: message });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원이 작성한 다이어리의 댓글 모두 조회하기 */
export const getAllCommentsByUsernameAndDiaryId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, diaryId } = req.params;

    const userTravelDiaryCommentInfos = await adminService.getAllCommentsByUsernameAndDiaryId(
      String(username),
      Number(diaryId)
    );

    res
      .status(200)
      .json({ data: userTravelDiaryCommentInfos, message: '회원이 작성한 다이어리의 댓글을 조회했습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
/**
 * [관리자] 회원이 작성한 모든 댓글 조회하기
 */
export const getAllCommentsByUsername = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const userAllComments = await adminService.getAllCommentsByUsername(String(username));

    res.status(200).json({ data: userAllComments, message: '회원이 작성한 모든 댓글을 조회했습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 특정 회원이 작성한 댓글 삭제하기 */
export const deleteCommentByUsernameAndDiaryId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, diaryId, commentId } = req.params;
    const message = await adminService.deleteCommentByUsernameAndDiaryId(
      String(username),
      Number(diaryId),
      Number(commentId)
    );
    res.status(200).json({ data: message });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 관광지 추가 */
export const addTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    let imgName = '';
    let inputPath = '';
    let compressed = '';

    if (req.files) {
      const files = req.files as Express.Multer.File[];
      const encodedFilename = encodeURIComponent(files[0].filename);
      imgName = files.length > 0 ? `${IMG_PATH}/${encodedFilename}` : '';
      inputPath = files.length > 0 ? path.join(__dirname, '../public', encodedFilename) : '';
      compressed = files.length > 0 ? path.join(__dirname, '../public/compressed', encodedFilename) : '';
    }

    const { nameEn, nameKo, introduction, latitude, longitude } = req.body;

    const message = await adminService.addTouristDestination(
      String(nameEn),
      String(nameKo),
      String(imgName),
      String(introduction),
      Number(latitude),
      Number(longitude)
    );

    let encodedImage = '';
    if (inputPath && compressed) {
      await compressImage(inputPath, compressed, 600, 600);
      const imgData = await fs.readFile(compressed);
      encodedImage = `data:image/jpeg;base64,${imgData.toString('base64')}`;
      fs.unlink(inputPath);
    }

    res.status(200).json({ message, encodedImage });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 관광지 수정하기 */
export const updateTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { locationId } = req.params;
    const { nameEn, nameKo, image, introduction } = req.body;

    if (!locationId) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '관광지를 찾을 수 없습니다.', 400);
    }
    const product = {
      nameEn: String(nameEn),
      nameKo: String(nameKo),
      image: String(image),
      introduction: String(introduction),
    };
    const message = await adminService.updateTouristDestination(String(locationId), product);
    res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 관광지 삭제하기 */
export const deleteTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { locationId } = req.params;
    const deletedData = await adminService.deleteTouristDestination(String(locationId));

    if (!locationId) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '관광지를 찾을 수 없습니다.', 400);
    }
    if (deletedData) {
      const imgName = deletedData.touristDestination.image.split('/compressed')[1];

      const filePath = path.join(__dirname, '../public/compressed', imgName);

      await fs.unlink(filePath);
    }

    res.status(200).json({ deletedData });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

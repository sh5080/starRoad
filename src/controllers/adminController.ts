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
    if(!users){
      throw new AppError(CommonError.RESOURCE_NOT_FOUND,'불러올 유저정보가 없습니다.',400)
    }
    const userCount: number = users.length;
    res.status(200).json({ data: { users, userCount, message: '모든 회원을 불러왔습니다.' } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 특정 회원 조회하기 */
export const getUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    console.log('회원 정보 수정 중...');
    const { id } = req.params;

    if (isNaN(Number(id))) {
      throw new AppError(CommonError.INVALID_INPUT, '입력값이 유효하지 않습니다.', 400);
    }

    const user = await adminService.getUser(Number(id));

    res.status(200).json({
      data: {
        user,
        message: '유저 조회에 성공하였습니다.',
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** [관리자] 회원 정보 업데이트 */
export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { username, name, email, role } = req.body;

    if (isNaN(Number(id))) {
      throw new AppError(CommonError.INVALID_INPUT, '입력값이 유효하지 않습니다.', 400);
    }

    const user = await adminService.getUser(Number(id));

    if (!user) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '존재하지 않는 유저입니다.', 400);
    }

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
    console.log(`${id} 회원 삭제중...`);

    if (isNaN(Number(id))) {
      throw new AppError(CommonError.INVALID_INPUT, '입력값이 유효하지 않습니다.', 400);
    }

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

    if (!username) {
      throw new AppError(CommonError.INVALID_INPUT, '입력값이 유효하지 않습니다.', 400);
    }

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

    if (!planId) {
      throw new AppError(CommonError.INVALID_INPUT, '입력값이 유효하지 않습니다.', 400);
    }

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

    let imgName:string[] = [];

    
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      const promises = files.map(async (file) => {
        const inputPath = path.join(__dirname, '../../public', file.filename);
        const compressedPath = path.join(__dirname, '../../public/compressed', file.filename);

        await compressImage(inputPath, compressedPath, 600, 600);

        const compressedFilename = path.basename(compressedPath);
        const encodedFilename = encodeURIComponent(compressedFilename);

        imgName.push(`${IMG_PATH}/${encodedFilename}`);

        await fs.unlink(inputPath);
      });
      await Promise.all(promises);
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
   res.status(200).json({nameEn, nameKo, introduction, latitude, longitude, imgName });
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

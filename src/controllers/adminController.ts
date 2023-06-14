import { Response, NextFunction } from 'express';
import { AppError, CommonError } from '../types/AppError';
import * as adminService from '../services/adminService';
import { CustomRequest } from '../types/customRequest';
import * as fs from 'node:fs/promises';
import { compressImage } from '../api/middlewares/sharp';
import config from '../config';
const IMG_PATH = config.server.IMG_PATH;
const DELETE_INPUT_PATH = config.paths.DELETE_INPUT_PATH;
const DELETE_COMPRESSED_PATH = config.paths.DELETE_COMPRESSED_PATH;

// [관리자] 모든 회원 조회하기
export const getAllUsers = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getAllUsers();
    const userCount: number = users.length;

    res.status(200).json({ data: { users, userCount, message: '모든 회원을 불러왔습니다.' } });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 회원 정보 수정하기
export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userInfo = req.body;
    const data = await adminService.updateUser(Number(id), userInfo);
    res.status(200).json({ data, message: '회원 정보 수정을 완료했습니다.' });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 회원 삭제하기
export const deleteUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const message = await adminService.deleteUser(Number(id));
    res.status(200).json({ message });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 회원이 작성한 여행 일정 조회하기
export const getAllUserInfoTravel = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const userTravelInfos = await adminService.getUserInfoTravel(String(username));
    res.status(200).json({ data: userTravelInfos, message: '회원이 작성한 여행 일정을 조회했습니다.' });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 회원이 작성한 날짜 장소 조회하기
export const getUserInfoAllLocation = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { plan_id } = req.params;

    const userTravelLocationInfos = await adminService.getUserInfoTravelLocation(Number(plan_id));

    res.status(200).json({ data: userTravelLocationInfos, message: '회원이 작성한 날짜별 장소를 조회했습니다.' });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 회원이 작성한 다이어리 모두 조회하기
export const getUserInfoAllDiary = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const userTravelDiaryInfos = await adminService.getUserInfoDiary(String(username));

    res.status(200).json({ data: userTravelDiaryInfos, message: '회원이 작성한 다이어리를 조회했습니다.' });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 회원이 작성한 다이어리 삭제하기
export const deleteDiaryByAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, plan_id } = req.params;
    const message = await adminService.deleteDiaryByAdmin(String(username), Number(plan_id));
    res.status(200).json({ data: message });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 회원이 작성한 다이어리의 댓글 모두 조회하기
export const getUserInfoAllComment = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, diary_id } = req.params;

    const userTravelDiaryCommentInfos = await adminService.getUserInfoComment(
      String(username),
      Number(diary_id)
    );

    res
      .status(200)
      .json({ data: userTravelDiaryCommentInfos, message: '회원이 작성한 다이어리의 댓글을 조회했습니다.' });
  } catch (error) {
    console.error(error)
    next(error);
  }
};
export const getUserAllComments = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const userAllComments = await adminService.getUserAllComment(String(username));

    res.status(200).json({ data: userAllComments, message: '회원이 작성한 모든 댓글을 조회했습니다.' });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 특정 회원이 작성한 댓글 삭제하기
export const deleteCommentByAdminController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, diary_id, comment_id } = req.params;
    const message = await adminService.deleteCommentByAdmin(
      String(username),
      Number(diary_id),
      Number(comment_id)
    );
    res.status(200).json({ data: message });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 관광지 추가하기
export const addTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    let imgName = '';
    let inputPath = '';
    let compressed = '';

    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];
      imgName = files.length > 0 ? `${IMG_PATH}/${files[0].filename}` : '';
      inputPath = files.length > 0 ? `/${DELETE_INPUT_PATH}/${files[0].filename}` : '';
      compressed = files.length > 0 ? `/${DELETE_COMPRESSED_PATH}/${files[0].filename}` : '';
    }

    const { name_en, name_ko, introduction, latitude, longitude } = req.body;

    if (!name_en || !name_ko || !introduction || !latitude || !longitude) {
      return next(new AppError(CommonError.INVALID_INPUT, '모두 입력해 주세요.', 400));
    }

    const message = await adminService.addTouristDestination(
      String(name_en),
      String(name_ko),
      String(imgName),
      String(introduction),
      Number(latitude),
      Number(longitude)
    );

    if (inputPath && compressed) {
      await compressImage(inputPath, compressed, 600, 600);
      fs.unlink(inputPath);
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 관광지 수정하기
// 현재 4가지 모두가 와야 수정되는 상황임.
// 안오는 프로퍼티가 있다면 undefined로 정의되고 데이터에 undefined로 들어가게 됨.
export const updateTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;
    const { name_en, name_ko, image, introduction } = req.body;

    const product = {
      name_en: String(name_en),
      name_ko: String(name_ko),
      image: String(image),
      introduction: String(introduction),
    };
    const message = await adminService.updateTouristDestination(String(location_id), product);
    res.status(200).json({ message: message });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

// [관리자] 관광지 삭제하기
export const deleteTouristDestination = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;
    const deletedData = await adminService.deleteTouristDestination(String(location_id));

    if (deletedData) {
      const imgName = deletedData.touristDestination.image.split('/compressed')[1];

      // imgName 파일을 찾아서 삭제
      // 상대경로 오류남 -> 절대경로로 수정
      const filePath = `/${DELETE_COMPRESSED_PATH}/${imgName}`;

      fs.unlink(filePath);
    }
    console.log('이미지 파일 삭제 완료');

    res.status(200).json({ deletedData });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

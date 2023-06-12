import { Response, NextFunction } from 'express';
import { AppError, CommonError } from '../types/AppError';
import * as adminService from '../services/adminService';
import { CustomRequest } from '../types/customRequest';
import * as fs from 'node:fs';
import { compressImage } from '../api/middlewares/sharp';

// [관리자] 모든 회원 조회하기
export const getAllUsersController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getAllUsersService();
    const userCount: number = users.length;

    res.status(200).json({ data: { users, userCount, message: '모든 회원을 불러왔습니다.' } });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '회원 정보 조회에 실패했습니다.', 500));
  }
};

// [관리자] 회원 정보 수정하기
export const updateUserController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userInfo = req.body;
    const data = await adminService.updateUserService(Number(id), userInfo);
    res.status(200).json({ data, message: '회원 정보 수정을 완료했습니다.' });
  } catch (err) {
    console.error(err);
    next(
      err instanceof AppError ? err : new AppError(CommonError.UNEXPECTED_ERROR, '회원 정보 수정에 실패했습니다.', 500)
    );
  }
};

// [관리자] 회원 삭제하기
export const deleteUserController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const message = await adminService.deleteUserService(Number(id));
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    next(
      err instanceof AppError ? err : new AppError(CommonError.UNEXPECTED_ERROR, '회원 정보 삭제에 실패했습니다.', 500)
    );
  }
};

// [관리자] 회원이 작성한 여행 일정 조회하기
export const getAllUserInfoTravelController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const userTravelInfos = await adminService.getUserInfoTravelService(String(username));
    res.status(200).json({ data: userTravelInfos, message: '회원이 작성한 여행 일정을 조회했습니다.' });
  } catch (err) {
    console.error(err);
    next(
      err instanceof AppError
        ? err
        : new AppError(CommonError.INVALID_INPUT, '회원이 작성한 여행 일정 조회에 실패했습니다.', 500)
    );
  }
};

// [관리자] 회원이 작성한 날짜 장소 조회하기
export const getUserInfoAllLocationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { plan_id } = req.params;

    const userTravelLocationInfos = await adminService.getUserInfoTravelLocationService(Number(plan_id));

    res.status(200).json({ data: userTravelLocationInfos, message: '회원이 작성한 날짜별 장소를 조회했습니다.' });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '회원이 작성한 날짜별 장소 조회에 실패했습니다.', 500));
  }
};

// [관리자] 회원이 작성한 다이어리 모두 조회하기
export const getUserInfoAllDiaryController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const userTravelDiaryInfos = await adminService.getUserInfoDiaryService(String(username));

    res.status(200).json({ data: userTravelDiaryInfos, message: '회원이 작성한 다이어리를 조회했습니다.' });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '회원이 작성한 다이어리 조회에 실패했습니다.', 500));
  }
};

// [관리자] 회원이 작성한 다이어리 삭제하기
export const deleteDiaryByAdminController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, plan_id } = req.params;
    const message = await adminService.deleteDiaryByAdminService(String(username), Number(plan_id));
    res.status(200).json({ data: message });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '회원이 작성한 다이어리 삭제에 실패했습니다.', 500));
  }
};

// [관리자] 회원이 작성한 다이어리의 댓글 모두 조회하기
export const getUserInfoAllCommentController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, diary_id } = req.params;

    const userTravelDiaryCommentInfos = await adminService.getUserInfoCommentService(
      String(username),
      Number(diary_id)
    );

    res
      .status(200)
      .json({ data: userTravelDiaryCommentInfos, message: '회원이 작성한 다이어리의 댓글을 조회했습니다.' });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '회원이 작성한 다이어리의 댓글 조회에 실패했습니다.', 500));
  }
};
export const getUserAllCommentsController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const userAllComments = await adminService.getUserAllCommentService(String(username));

    res.status(200).json({ data: userAllComments, message: '회원이 작성한 모든 댓글을 조회했습니다.' });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '회원이 작성한 모든 댓글 조회에 실패했습니다.', 500));
  }
};

// [관리자] 특정 회원이 작성한 댓글 삭제하기
export const deleteCommentByAdminController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username, diary_id, comment_id } = req.params;
    const message = await adminService.deleteCommentByAdminService(
      String(username),
      Number(diary_id),
      Number(comment_id)
    );
    res.status(200).json({ data: message });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '회원이 작성한 댓글 삭제에 실패했습니다.', 500));
  }
};

// [관리자] 관광지 추가하기
export const addTouristDestinationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const imgName = req.file ? `http://localhost:3000/images/compressed/${req.file.filename}` : '';
    // 로컬에서 테스트 시 images => static으로 변경

    const { name_en, name_ko, introduction } = req.body;

    if (!name_en || !name_ko || !introduction) {
      return next(new AppError(CommonError.INVALID_INPUT, '모두 입력해 주세요.', 400));
    }

    const message = await adminService.addTouristDestinationService(
      String(name_en),
      String(name_ko),
      String(imgName),
      String(introduction)
    );

    const inputPath = `/Users/heesankim/Desktop/eliceProject2/back-end/public/${req.file?.filename}`;
    const compressed = `/Users/heesankim/Desktop/eliceProject2/back-end/public/compressed/${req.file?.filename}`;
    await compressImage(inputPath, compressed, 600, 600);
    fs.unlinkSync(`/Users/heesankim/Desktop/eliceProject2/back-end/public/${req.file?.filename}`);
    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    next(new AppError(CommonError.UNEXPECTED_ERROR, '관광지 추가에 실패했습니다.', 500));
  }
};

// [관리자] 관광지 수정하기
// 현재 4가지 모두가 와야 수정되는 상황임.
// 안오는 프로퍼티가 있다면 undefined로 정의되고 데이터에 undefined로 들어가게 됨.
export const updateTouristDestinationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;
    const { name_en, name_ko, image, introduction } = req.body;

    const product = {
      name_en: String(name_en),
      name_ko: String(name_ko),
      image: String(image),
      introduction: String(introduction),
    };
    const message = await adminService.updateTouristDestinationService(String(location_id), product);
    res.status(200).json({ message: message });
  } catch (err) {
    next(new AppError(CommonError.UNEXPECTED_ERROR, '관광지 수정에 실패했습니다.', 500));
  }
};

// [관리자] 관광지 삭제하기
export const deleteTouristDestinationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;
    const deletedData = await adminService.deleteTouristDestinationService(String(location_id));

    if (deletedData) {
      const imgName = deletedData.touristDestination.image.split('/compressed')[1];

      // imgName 파일을 찾아서 삭제
      // 상대경로 오류남 -> 절대경로로 수정
      const filePath = `/Users/heesankim/Desktop/eliceProject2/back-end/public/compressed${imgName}`;

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
        console.log('File deleted successfully');
      });
    }

    res.status(200).json({ deletedData });
  } catch (err) {
    next(new AppError(CommonError.UNEXPECTED_ERROR, '관광지 삭제에 실패했습니다.', 500));
  }
};

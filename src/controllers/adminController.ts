import { Response, NextFunction } from 'express';
import { AppError, CommonError } from '../api/middlewares/errorHandler';
import * as adminService from '../services/adminService';
import { CustomRequest } from '../types/customRequest';

// [관리자] 모든 회원 조회하기
export const getAllUsersController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    console.log('모든 회원 불러오는 중...');
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
    console.log('회원 정보 수정 중...');
    const { id } = req.params;
    const user = req.body;
    const data = await adminService.updateUserService(Number(id), user);
    console.log('updatedUser = ', data);
    console.log('회원 정보 수정 완료');
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
    console.log(`${id} 회원 삭제중...`);

    // const user = await getUser(String(user_id));
    // if (!user.activated) {
    //   return res.status(400).json({ message: '탈퇴한 회원입니다' });
    // }
    const message = await adminService.deleteUserService(Number(id));
    console.log(message);

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
    const { user_id } = req.params;

    const userTravelInfos = await adminService.getUserInfoTravelService(String(user_id));
    console.log('userInfo = ', userTravelInfos);
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
export const getUserInfoAllLocationController = async (req: CustomRequest, res: Response) => {
  try {
    const { plan_id } = req.params;

    const userTravelLocationInfos = await adminService.getUserInfoTravelLocationService(Number(plan_id));

    res.status(200).json({ data: userTravelLocationInfos, message: '회원이 작성한 날짜별 장소를 조회했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원이 작성한 날짜별 장소 조회에 실패했습니다.' });
  }
};

// [관리자] 회원이 작성한 다이어리 모두 조회하기
export const getUserInfoAllDiaryController = async (req: CustomRequest, res: Response) => {
  try {
    const { user_id } = req.params;

    const userTravelDiaryInfos = await adminService.getUserInfoDiaryService(String(user_id));

    res.status(200).json({ data: userTravelDiaryInfos, message: '회원이 작성한 다이어리를 조회했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원이 작성한 다이어리 조회에 실패했습니다.' });
  }
};

// [관리자] 회원이 작성한 다이어리 삭제하기
export const deleteDiaryByAdminController = async (req: CustomRequest, res: Response) => {
  try {
    const { user_id, plan_id } = req.params;
    const message = await adminService.deleteDiaryByAdminService(String(user_id), Number(plan_id));
    res.status(200).json({ data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원이 작성한 다이어리 삭제에 실패했습니다.' });
  }
};

// 회원이 작성한 다이어리의 댓글들은 관리자뿐만 아니라 원래 볼 수 있음.(아마 필요없을수도있음 밑에 코드는)
// [관리자] 회원이 작성한 댓글 모두 조회하기
export const getUserInfoAllCommentController = async (req: CustomRequest, res: Response) => {
  try {
    const { user_id, diary_id } = req.params;

    const userTravelDiaryCommentInfos = await adminService.getUserInfoCommentService(String(user_id), Number(diary_id));

    res
      .status(200)
      .json({ data: userTravelDiaryCommentInfos, message: '회원이 작성한 다이어리의 댓글을 조회했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원이 작성한 다이어리의 댓글 조회에 실패했습니다.' });
  }
};

// [관리자] 특정 회원이 작성한 모든 댓글 조회하기
export const getUserAllCommentsController = async (req: CustomRequest, res: Response) => {
  try {
    const { user_id } = req.params;

    const userAllComments = await adminService.getUserAllCommentService(String(user_id));

    res.status(200).json({ data: userAllComments, message: '회원이 작성한 모든 댓글을 조회했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원이 작성한 모든 댓글 조회에 실패했습니다.' });
  }
};

// [관리자] 특정 회원이 작성한 댓글 삭제하기
export const deleteCommentByAdminController = async (req: CustomRequest, res: Response) => {
  try {
    const { user_id, diary_id, comment_id } = req.params;
    const message = await adminService.deleteCommentByAdminService(
      String(user_id),
      Number(diary_id),
      Number(comment_id)
    );
    res.status(200).json({ data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원이 작성한 댓글 삭제에 실패했습니다.' });
  }
};

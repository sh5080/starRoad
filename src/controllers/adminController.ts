import { Response, NextFunction } from 'express';
import { AppError } from '../api/middlewares/errorHandler';
import { getAllUsersService, updateUserService, deleteUserService } from '../services/adminService';
import { CustomRequest } from '../types/customRequest';

export const getAllUsersController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    console.log('모든 회원 불러오는 중...');
    const users = await getAllUsersService();
    console.log(users);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    next(new AppError('회원 정보 조회에 실패했습니다.', 500));
  }
};

export const updateUserController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.body;

    const updatedUser = await updateUserService(Number(id), user);

    res.status(200).json({ updatedUser });
  } catch (err) {
    console.error(err);
    next(err instanceof AppError ? err : new AppError('회원 정보 수정에 실패했습니다.', 500));
  }
};

export const deleteUserController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const message = await deleteUserService(Number(id));

    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    next(err instanceof AppError ? err : new AppError('회원 정보 삭제에 실패했습니다.', 500));
  }
};

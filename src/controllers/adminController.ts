import { Request, Response } from 'express';
import { AppError } from '../api/middlewares/errorHandler';
import { getAllUsersService, updateUserService, deleteUserService } from '../services/adminService';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string; role: string };
  params: {
    id?: string; // Add this
  };
  body: {
    user_id?: string; // Add this
  };
}
export const getAllUsersController = async (req: CustomRequest, res: Response) => {
  try {
    console.log('모든 회원 불러오는 중...');
    const users = await getAllUsersService();
    console.log(users);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원 정보 조회에 실패했습니다.' });
  }
};

export const updateUserController = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.body;

    const message = await updateUserService(Number(id), user);

    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '회원 정보 수정에 실패했습니다.' });
    }
  }
};

export const deleteUserController = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const message = await deleteUserService(Number(id));

    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '회원 정보 삭제에 실패했습니다.' });
    }
  }
};

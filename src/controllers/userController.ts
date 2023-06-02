import { Request, Response } from 'express';
import { signupUser, loginUser, getUser, updateUser } from '../services/userService';
import { UserType } from '../types/user';
import { AppError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';

// 회원가입
export const signup = async (req: Request, res: Response) => {
  try {
    const user: UserType = req.body;

    if (!user.userId || !user.password || !user.email || !user.name) {
      return res.status(400).json({ error: '회원가입에 필요한 정보가 제공되지 않았습니다.' });
    }

    const message = await signupUser(user);

    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
  }
};

// 로그인
export const login = async (req: Request, res: Response) => {
  try {
    const { userId, password }: UserType = req.body;

    if (!userId || !password) {
      return res.status(400).json({ error: '로그인에 필요한 정보가 제공되지 않았습니다.' });
    }

    const token = await loginUser(userId, password);

    // 두 개의 토큰을 보내줌
    res.json({ token });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '로그인에 실패했습니다.' });
    }
  }
};

interface CustomRequest extends Request {
  user?: JwtPayload & { userId: string };
}

// 내 정보 조회
export const getUserInfo = async (req: CustomRequest, res: Response) => {
  // req는 언제든 조회
  try {
    // req.user가 없는 경우 에러 처리
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    const { userId } = req.user;
    const userData = await getUser(userId);

    if (!userData) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(userId);
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '사용자 조회에 실패했습니다.' });
    }
  }
};

export const updateUserInfo = async (req: CustomRequest, res: Response) => {
  // req는 언제든 조회
  try {
    // req.user가 없는 경우 에러 처리
    if (!req.user) {
      throw new AppError('인증이 필요합니다.', 401);
    }

    const { userId } = req.user;
    const updateData = req.body;

    const updatedUserData = await updateUser(userId, updateData);

    if (!updatedUserData) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(updatedUserData); 
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '사용자 정보 업데이트에 실패했습니다.' });
    }
  }
};


import { NextFunction, Request, Response } from 'express';
import { signupUser, loginUser, getUser, updateUser, deleteUser } from '../services/userService';
import { UserType } from '../types/user';
import { AppError, CommonError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';
// 회원가입
export const signup = async (req: Request, res: Response) => {
  try {
    const user: UserType = req.body;

    if (!user.user_id || !user.password || !user.email || !user.name) {
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
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, password }: UserType = req.body;

    if (!user_id || !password) {
      return res.status(400).json({ error: '로그인에 필요한 정보가 제공되지 않았습니다.' });
    }

    const userData = await getUser(user_id);

    console.log(userData);
    if (!userData.activated) {
      return res.status(400).json({ error: '탈퇴한 회원입니다.' });
    }

    const token = await loginUser(user_id, password);

    res.json({ token });
  } catch (err) {
    console.error(err);
    next(err); // 에러를 next 함수를 통해 errorHandler 미들웨어로 전달합니다.
  }
};
export const logout = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,'인증이 필요합니다.', 401);
    }
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '로그아웃 실패했습니다.' });
    }
  }
};

interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string };
}

// 내 정보 조회
export const getUserInfo = async (req: CustomRequest, res: Response) => {
  // req는 언제든 조회
  try {
    // req.user가 없는 경우 에러 처리
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,'인증이 필요합니다.', 401);
    }

    const { user_id } = req.user;
    const userData = await getUser(user_id);

    if (!userData) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ userData });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '사용자 조회에 실패했습니다.' });
    }
  }
};
// 회원 정보 수정
export const updateUserInfo = async (req: CustomRequest, res: Response) => {
  try {
    // req.user가 없는 경우 에러 처리
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,'인증이 필요합니다.', 401);
    }

    const { user_id } = req.user;
    const updateData = req.body;

    const updatedUserData = await updateUser(user_id, updateData);

    if (!updatedUserData) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ updatedUserData });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '사용자 정보 업데이트에 실패했습니다.' });
    }
  }
};

// 회원 탈퇴
export const deleteUserInfo = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,'인증이 필요합니다.', 401);
    }

    const { user_id } = req.user;
    const message = await deleteUser(user_id);

    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: '사용자 정보 삭제에 실패했습니다.' });
    }
  }
};

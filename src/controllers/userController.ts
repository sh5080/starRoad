import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';
import { UserType } from '../types/user';
import { AppError, CommonError } from '../api/middlewares/errorHandler';
import { JwtPayload } from 'jsonwebtoken';
// 회원가입
export const signup = async (req: Request, res: Response) => {
  try {
    const user: UserType = req.body;

    if (!user.user_id || !user.password || !user.email || !user.name) {
      throw new AppError(CommonError.INVALID_INPUT,'회원가입에 필요한 정보가 제공되지 않았습니다.',400);
    }
    const message = await userService.signupUser(user);

    res.status(201).json({ message });
  }catch (error) {
    switch (error) {
      case CommonError.INVALID_INPUT:
        break;
      default:
        console.error(error);
        res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
  }
};

// 로그인
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, password }: UserType = req.body;

    if (!user_id || !password) {
      throw new AppError(CommonError.INVALID_INPUT,'로그인에 필요한 정보가 제공되지 않았습니다.',400);
    }
    const userData = await userService.getUser(user_id);
    console.log(userData);

    if (!userData.activated) {
      throw new AppError(CommonError.UNAUTHORIZED_ACCESS,'탈퇴한 회원입니다.',400)
    }
    const token = await userService.loginUser(user_id, password);
    res.json({ token });
  } catch (error) {
    switch (error) {
      case CommonError.INVALID_INPUT:
      case CommonError.UNAUTHORIZED_ACCESS:
        next(error)
        break;
      default:
        //console.error(error);
        res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
  }
};
export const logout = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR,'인증이 필요합니다.', 401);
    }
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  }catch (error) {
    switch (error) {
      case CommonError.AUTHENTICATION_ERROR:
        break;
      default:
        //console.error(error);
        res.status(500).json({ error: '로그아웃에 실패했습니다.' });
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
    const userData = await userService.getUser(user_id);

    if (!userData) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND,'사용자를 찾을 수 없습니다.',404);
    }
    res.status(200).json({ userData });
  }catch (error) {
    switch (error) {
      case CommonError.AUTHENTICATION_ERROR:
      case CommonError.RESOURCE_NOT_FOUND:
        break;
      default:
        //console.error(error);
        res.status(500).json({ error: '사용자 조회에 실패했습니다.' });
    }
  }
};
// 회원 정보 수정
export const updateUserInfo = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '인증이 필요합니다.', 401);
    }

    const { user_id } = req.user;
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 이메일과 비밀번호를 입력해주세요.', 400);
    }

    const updatedUserData = await userService.updateUser(user_id, { email, password });

    res.status(200).json({ updatedUserData });
  } catch (error) {
    switch (error) {
      case CommonError.AUTHENTICATION_ERROR:
      case CommonError.INVALID_INPUT:
        break;
      default:
        console.error(error);
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
    const message = await userService.deleteUser(user_id);

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

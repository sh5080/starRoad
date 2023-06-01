import { Request, Response } from 'express';
import { signupUser, loginUser } from '../services/userService';
import { UserType } from '../types/user';

export const signup = async (req: Request, res: Response) => {
  try {
    const user: UserType = req.body;

    const message = await signupUser(user);

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({
      error: '회원가입에 실패했습니다.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userId, password }: UserType = req.body;

    const token = await loginUser(userId, password);

    // 두 개의 토큰을 보내줌
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '로그인이 실패했습니다.' });
  }
};

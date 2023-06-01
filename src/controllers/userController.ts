import { Request, Response } from 'express';
import { signupUser, loginUser, getUser } from '../services/userService';
import { ParamsDictionary } from 'express-serve-static-core';
import { UserType } from '../types/user';

// 회원가입
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
// 로그인
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

// 내 정보 조회
export const getUserinfo = async (req: Request, res: Response) => {
  try {
    let { userId }: ParamsDictionary = req.params;

    const userData = await getUser(userId);
    if (!userData) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json(userId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '사용자 조회에 실패했습니다.' });
  }
};

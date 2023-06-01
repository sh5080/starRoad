import { Request, Response } from 'express';
import { signupUser, loginUser, getUser } from '../services/userService';
import { User } from '../types/user';
import { ParamsDictionary } from 'express-serve-static-core';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, userId, password, email }: User = req.body;
    
    const message = await signupUser(name, userId, password, email);

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({
      error: '회원가입에 실패했습니다.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userId, password }: User = req.body;
    
    const token = await loginUser(userId, password);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '로그인이 실패했습니다.' });
  }
};


export const getUserinfo = async (req: Request, res: Response) => {
  try {
    let  { userId }:  ParamsDictionary = req.params;

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


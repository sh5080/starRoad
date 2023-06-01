import { Request, Response } from 'express';
import { signupUser, loginUser } from '../services/userService';
import { User } from '../types/user';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, userid, password, email }: User = req.body;
    
    const message = await signupUser(name, userid, password, email);

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({
      error: '회원가입에 실패했습니다.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userid, password }: User = req.body;
    
    const token = await loginUser(userid, password);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '로그인이 실패했습니다.' });
  }
};

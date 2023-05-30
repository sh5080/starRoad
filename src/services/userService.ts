import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../config';
import { createUser, getUserByEmail } from '../models/user';
import { User } from '../types/user';
import jwt from 'jsonwebtoken';

const { saltRounds } = config.bcrypt;
const jwtSecret = config.jwt.secret;

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: User = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //console.log("여기")
    await createUser({ name, email, password: hashedPassword });
    console.log("여기1")
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({
      error: '서버 에러',
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: User = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: '이메일이 존재하지 않습니다.' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign({ email: user.email }, jwtSecret);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '서버 에러' });
  }
};

export { signup, login };

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../config';
import { createUser, getUserById } from '../models/user';
import { User } from '../types/user';
import jwt from 'jsonwebtoken';

const { saltRounds } = config.bcrypt;
const jwtSecret = config.jwt.secret;

const signup = async (req: Request, res: Response) => {
  try {
    const { name, userid, password, email }: User = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log("여기")

    await createUser({ name, userid, password: hashedPassword, email }); // 여기서 오류 

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({
      error: '서버 에러',
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { userid, password }: User = req.body;
    const user = await getUserById(userid);
    if (!user) {
      return res.status(401).json({ error: '이메일이 존재하지 않습니다.' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign({ userid: user.userid }, jwtSecret);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '서버 에러' });
  }
};

export { signup, login };

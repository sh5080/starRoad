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

    const findUserid = await getUserById(userid);
    if (findUserid) {
      return res.status(400).json({ error: '이미 사용중인 아이디입니다.' });
    }

    await createUser({ name, userid, password: hashedPassword, email });

    res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
  } catch (err) {
    res.status(500).json({
      error: '회원가입에 실패했습니다.',
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { userid, password }: User = req.body;
    const user = await getUserById(userid);
    if (!user) {
      return res.status(401).json({ error: '존재하지 않는 아이디 입니다.' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign({ userid: user.userid }, jwtSecret);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: '로그인이 실패했습니다.' });
  }
};

export { signup, login };

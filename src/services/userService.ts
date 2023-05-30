import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../config';
import { createUser } from '../models/user';
import { User } from '../types/user';

const { saltRounds } = config.bcrypt;

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: User = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("여기")
    await createUser({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({
      error: '서버 에러',
    });
  }
};

export { signup };

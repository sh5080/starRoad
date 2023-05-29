import { Request, Response } from 'express';
import { db } from '../loaders/dbLoader';
import bcrypt from 'bcrypt';
import config from '../config';

const { saltRounds } = config.bcrypt;

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const pool = await db;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);
    res.status(201).json(rows);
  } catch (err) {
    res.status(500).json({
      error: '서버 에러',
    });
  }
};

export { signup };

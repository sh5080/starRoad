import bcrypt from 'bcrypt';
import { createUser, getUserById } from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config';

const { saltRounds } = config.bcrypt;
const jwtSecret = config.jwt.secret;

export const signupUser = async (name: string, userId: string, password: string, email: string) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const findUserid = await getUserById(userId);
  if (findUserid) {
    throw new Error('이미 사용중인 아이디입니다.');
  }

  await createUser({ name, userId, password: hashedPassword, email });

  return '회원가입이 성공적으로 완료되었습니다.';
};

export const loginUser = async (userId: string, password: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('존재하지 않는 아이디입니다.');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const token = jwt.sign({ userId: user.userId }, jwtSecret);

  return token;
};

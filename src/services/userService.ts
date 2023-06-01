import bcrypt from 'bcrypt';
import { createUser, getUserById } from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UserType } from '../types/user';

const { saltRounds } = config.bcrypt;
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

export const signupUser = async (user: UserType): Promise<string> => {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  const findUserid = await getUserById(user.userId);
  if (findUserid) {
    throw new Error('이미 사용중인 아이디입니다.');
  }

  await createUser({ ...user, password: hashedPassword });

  return '회원가입이 성공적으로 완료되었습니다.';
};

export const loginUser = async (userId: string, password: string): Promise<object> => {
  const user = await getUserById(userId);
  //console.log(user)
  if (!user) {
    throw new Error('존재하지 않는 아이디입니다.');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const accessToken: string = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken: string = jwt.sign({ userId: user.userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};



export const getUser = async (userId: string) => {
  const user = await getUserById(userId);
  //console.log(user)
  if (!user) {
    throw new Error('없는 사용자 입니다.');
  }
  const { password, ...userData } = user;

  return userData;
};
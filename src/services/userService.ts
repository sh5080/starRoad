// DTO : 어떤형식으로 데이터가 가야하는지
// ENTITY : db에서 가져온값. 1 ROW 1 ENTITY

import bcrypt from 'bcrypt';
import { createUser, getUserById, updateUserById, deleteUserById } from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UserType } from '../types/user';
import { AppError } from '../api/middlewares/errorHandler';

const { saltRounds } = config.bcrypt;
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

export const signupUser = async (user: UserType): Promise<string> => {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  const findUserId = await getUserById(user.userId);
  if (findUserId) {
    throw new AppError('이미 존재하는 아이디입니다.', 409);
  }

  await createUser({ ...user, password: hashedPassword });

  return '회원가입이 정상적으로 완료되었습니다.';
};

export const loginUser = async (userId: string, password: string): Promise<object> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError('없는 사용자 입니다.', 404);
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('비밀번호가 일치하지 않습니다.', 401);
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

  if (!user) {
    throw new AppError('없는 사용자 입니다.', 404);
  }
  const { id, password, ...userData } = user;

  return userData;
};

export const updateUser = async (userId: string, updateData: Partial<UserType>) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt();
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }
  const updatedUser = await updateUserById(userId, updateData);

  if (!updatedUser) {
    throw new AppError('사용자 정보 업데이트에 실패했습니다.', 500);
  }
  return '회원정보 수정이 정상적으로 완료되었습니다.';
};

export const deleteUser = async (userId: string) => {
  const deletedUser = await deleteUserById(userId);

  if (!deletedUser) {
    throw new Error('사용자 정보 삭제에 실패했습니다.');
  }

  return '회원정보가 성공적으로 삭제되었습니다.';
};
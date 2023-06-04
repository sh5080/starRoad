import bcrypt from 'bcrypt';
import { createUser, getUserById, updateUserById, deleteUserById } from '../models/userModel';
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
  const hashedPassword = await bcrypt.hash(String(user.password), saltRounds);

  const findUserId = await getUserById(String(user.user_id));
  if (findUserId) {
    throw new AppError('이미 존재하는 아이디입니다.', 409);
  }

  await createUser({ ...user, password: hashedPassword });

  return '회원가입이 정상적으로 완료되었습니다.';
};

export const loginUser = async (user_id: string, password: string): Promise<object> => {
  const user = await getUserById(user_id);

  if (!user) {
    throw new AppError('없는 사용자 입니다.', 404);
  }

  if (!user.activated) {
    throw new AppError('탈퇴한 회원입니다.', 400);
  }

  const isPasswordMatch = await bcrypt.compare(password, String(user.password));
  if (!isPasswordMatch) {
    throw new AppError('비밀번호가 일치하지 않습니다.', 401);
  }

  const accessToken: string = jwt.sign({ user_id: user.user_id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken: string = jwt.sign({ user_id: user.user_id, role: user.role }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const getUser = async (user_id: string) => {
  const user = await getUserById(user_id);

  if (!user) {
    throw new AppError('없는 사용자 입니다.', 404);
  }
  const { id, password, ...userData } = user;

  return userData;
};

export const updateUser = async (user_id: string, updateData: Partial<UserType>) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt();
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }
  const updatedUser = await updateUserById(user_id, updateData);

  if (!updatedUser) {
    throw new AppError('사용자 정보 업데이트에 실패했습니다.', 500);
  }
  return '회원정보 수정이 정상적으로 완료되었습니다.';
};

export const deleteUser = async (user_id: string) => {
  const deletedUser = await deleteUserById(user_id);

  if (!deletedUser) {
    throw new Error('사용자 정보 삭제에 실패했습니다.');
  }

  return '회원정보가 성공적으로 삭제되었습니다.';
};

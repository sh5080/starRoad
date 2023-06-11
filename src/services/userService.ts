import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UserType } from '../types/user';
import { AppError, CommonError } from '../types/AppError';

const { saltRounds } = config.bcrypt;
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

export const signupUser = async (user: UserType): Promise<string> => {
  const hashedPassword = await bcrypt.hash(String(user.password), saltRounds);

  const foundUserId = await userModel.getUserByUsername(String(user.username));
  if (foundUserId) {
    throw new AppError(CommonError.DUPLICATE_ENTRY, '이미 존재하는 아이디입니다.', 409);
  }

  await userModel.createUser({ ...user, password: hashedPassword });

  return '회원가입이 정상적으로 완료되었습니다.';
};

export const loginUser = async (username: string, password: string): Promise<object> => {
  const user = await userModel.getUserByUsername(username);

  if (!user) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '없는 사용자 입니다.', 404);
  }

  if (!user.activated) {
    throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '탈퇴한 회원입니다.', 400);
  }

  const isPasswordMatch = await bcrypt.compare(password, String(user.password));
  if (!isPasswordMatch) {
    throw new AppError(CommonError.AUTHENTICATION_ERROR, '비밀번호가 일치하지 않습니다.', 401);
  }

  const accessToken: string = jwt.sign({ username: user.username, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken: string = jwt.sign({ username: user.username, role: user.role }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const getUser = async (username: string) => {
  const user = await userModel.getUserByUsername(username);

  if (!user) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '없는 사용자 입니다.', 404);
  }
  const { id, password, ...userData } = user;

  return userData;
};

export const updateUser = async (username: string, updateData: Partial<UserType>) => {
  // 기존 유저 정보 가져오기
  const existingUser = await userModel.getUserByUsername(username);

  if (!existingUser) {
    throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보를 찾을 수 없습니다.', 404);
  }

  if (updateData.email && updateData.email === existingUser.email) {
    throw new AppError(CommonError.INVALID_INPUT, '새로운 이메일을 입력해주세요.', 400);
  }

  if (updateData.password) {
    // 비밀번호가 변경되었는지 확인
    const isSamePassword = await bcrypt.compare(updateData.password, existingUser.password || '');
    if (isSamePassword) {
      throw new AppError(CommonError.INVALID_INPUT, '새로운 비밀번호를 입력해주세요.', 400);
    }

    // 새 비밀번호를 해시하여 저장
    const salt = await bcrypt.genSalt();
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const updatedUser = await userModel.updateUserByUsername(username, updateData);

  if (!updatedUser) {
    throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 업데이트에 실패했습니다.', 500);
  }
  const { password, ...userInfo } = updatedUser;
  return userInfo;
};

export const deleteUser = async (username: string) => {
  try {
    const deletedUser = await userModel.deleteUserByUsername(username);
    return deletedUser;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, '회원 삭제에 실패했습니다.', 500);
  }
};

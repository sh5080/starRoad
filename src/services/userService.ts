import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as User from '../types/user';
import { AppError, CommonError } from '../types/AppError';

const { saltRounds } = config.bcrypt;
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

/**
 * 사용자 회원가입
 */
export const signupUser = async (user: User.UserType) => {
  try {
    const hashedPassword = await bcrypt.hash(String(user.password), saltRounds);
    const foundUserId = await userModel.getUserByUsername(String(user.username));
    if (foundUserId) {
      throw new AppError(CommonError.DUPLICATE_ENTRY, '이미 존재하는 아이디입니다.', 409);
    }

    await userModel.createUser({ ...user, password: hashedPassword });
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '회원가입에 실패했습니다.', 500);
    }
  }
};

/**
 * 사용자 로그인
 */
export const loginUser = async (username: string, password: string): Promise<object> => {
  try {
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
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '로그인에 실패했습니다.', 500);
    }
  }
};

/**
 * 사용자 정보 조회
 */
export const getUser = async (username?: string) => {
  try {
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '로그인 후 이용가능합니다.', 404);
    }
    const { id, password, ...userData } = user;

    return userData;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '회원정보 조회에 실패했습니다.', 500);
    }
  }
};

/**
 * 사용자 정보 업데이트
 */
export const updateUser = async (username: string, updateData: Partial<User.UserType>) => {
  try {
    const existingUser = await userModel.getUserByUsername(username);

    if (!existingUser) {
      throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보를 찾을 수 없습니다.', 404);
    }

    if (!updateData.email && !updateData.password) {
      throw new AppError(CommonError.INVALID_INPUT, '새로운 이메일 또는 비밀번호를 입력해주세요.', 400);
    }

    if (updateData.email && updateData.password) {
      const isSamePassword = await bcrypt.compare(updateData.password, existingUser.password ?? '');
      if (isSamePassword && updateData.email === existingUser.email) {
        throw new AppError(CommonError.INVALID_INPUT, '새로운 이메일 또는 비밀번호를 입력해주세요.', 400);
      }

      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await userModel.updateUserByUsername(username, updateData);

    if (!updatedUser) {
      throw new AppError(CommonError.UNEXPECTED_ERROR, '사용자 정보 수정에 실패했습니다.', 500);
    }
    const { password, ...userInfo } = updatedUser;
    return userInfo;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '회원정보 수정에 실패했습니다.', 500);
    }
  }
};

/**
 * 사용자 삭제
 */
export const deleteUser = async (username: string) => {
  try {
    const deletedUser = await userModel.deleteUserByUsername(username);
    return deletedUser;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '회원탈퇴에 실패했습니다.', 500);
    }
  }
};

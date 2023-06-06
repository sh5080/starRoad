import { getAllUsersModel, updateUserByIdModel, deleteUserByIdModel } from '../models/adminModel';
import { UserType } from '../types/user';

export const getAllUsersService = async (): Promise<UserType[]> => {
  return getAllUsersModel();
};

export const updateUserService = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  const updatedUser = await updateUserByIdModel(id, user);
  return updatedUser;
};

export const deleteUserService = async (id: number): Promise<string> => {
  await deleteUserByIdModel(id);
  return '회원 정보가 정상적으로 삭제되었습니다.';
};

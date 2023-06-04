import { UserType } from '../types/user';
import { db } from '../loaders/dbLoader';

// [관리자] 모든 회원 정보 불러오기
export const getAllUsersModel = async (): Promise<UserType[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM user');
    return rows as UserType[];
  } finally {
    connection.release();
  }
};

// [관리자] 회원 정보 업데이트
export const updateUserByIdModel = async (id: number, user: Partial<UserType>): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE user SET ? WHERE id = ?', [user, id]);
  } finally {
    connection.release();
  }
};

// [관리자] 회원 정보 삭제
export const deleteUserByIdModel = async (id: number): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('DELETE FROM user WHERE id = ?', [id]);
  } finally {
    connection.release();
  }
};

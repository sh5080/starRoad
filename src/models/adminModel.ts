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
export const updateUserByIdModel = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  const connection = await db.getConnection();
  try {
    await connection.query('UPDATE user SET ? WHERE id = ?', [user, id]);
    const [rows] = await connection.query('SELECT * FROM user WHERE id = ?', [id]);
    const [updatedUser] = rows as UserType[];
    return updatedUser;
  } finally {
    connection.release();
  }
};

// [관리자] 회원 정보 삭제
export const deleteUserByIdModel = async (id: number): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE user SET activated = 0 WHERE id = ?', [id]);
  } finally {
    connection.release();
  }
};

// DELETE FROM user WHERE id = ?
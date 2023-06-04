import { OkPacket } from 'mysql2';
import { db } from '../loaders/dbLoader';
import { UserType } from '../types/user';

export const createUser = async (user: UserType): Promise<void> => {
  // const pool = db;
  const connection = await db.getConnection();
  try {
    await connection.execute('INSERT INTO user (name, user_id, password, email) VALUES (?, ?, ?, ?)', [
      user.name,
      user.user_id,
      user.password,
      user.email,
    ]);
  } finally {
    connection.release(); // 연결 해제
  }
};

// 로그인,정보 조회시 사용
export const getUserById = async (user_id: string): Promise<UserType | null> => {
  // const pool = await db;
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM user WHERE user_id = ?', [user_id]);
    if (Array.isArray(rows) && rows.length > 0) {
      const userData = rows[0] as UserType;
      return userData;
    }
    return null;
  } finally {
    connection.release(); // 연결 해제
  }
};

export const updateUserById = async (
  user_id: string,
  updateData: Partial<Pick<UserType, 'email' | 'password'>>
): Promise<UserType | null> => {
  const pool = await db;
  const connection = await pool.getConnection();
  try {
    //사용자 데이터 업데이트
    const [result] = await connection.query<OkPacket>('UPDATE user SET ? WHERE user_id = ?', [updateData, user_id]);

    if (!result.affectedRows) {
      return null;
    }
    //업데이트된 사용자 데이터 가져옴
    const [updatedUserRows] = await connection.execute('SELECT * FROM user WHERE user_id = ?', [user_id]);
    if (Array.isArray(updatedUserRows) && updatedUserRows.length > 0) {
      const updatedUser = updatedUserRows[0] as UserType;
      return updatedUser;
    }
    return null;
  } finally {
    connection.release(); // 연결 해제
  }
};

export const deleteUserById = async (user_id: string): Promise<boolean> => {
  const pool = await db;
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query<OkPacket>('DELETE FROM user WHERE user_id = ?', [user_id]);

    if (result.affectedRows > 0) {
      return true; // 삭제 성공
    }

    return false; // 삭제 실패
  } finally {
    connection.release();
  }
};

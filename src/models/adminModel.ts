import { UserType } from '../types/user';
import { db } from '../loaders/dbLoader';
import { TravelPlan } from '../types/travel';
import { Diary } from '../types/diary';
import { Comment } from '../types/comment';
import { TouristDestinationType } from '../types/destination';
import { AppError, CommonError } from '../types/AppError';
import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import { rowToCamelCase } from '../util/rowToCamelCase';
import { FitEnum } from 'sharp';
import { Deserializer } from 'v8';

/** [관리자] 모든 회원 정보 불러오기 */
export const getAllUsers = async (): Promise<UserType[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM user');
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch all user information', 500);
  }
};

/** [관리자] 회원 정보 불러오기 */
export const getUser = async (id: number): Promise<UserType> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(`SELECT * FROM user WHERE id = ?`, [id]);

    if (rows.length === 0) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, 'User not found', 404);
    }

    return rowToCamelCase(rows[0]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch user information', 500);
  }
};

/** [관리자] 회원 정보 업데이트 */
export const updateUserById = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { username, name, email, role } = user;

    await connection.execute('UPDATE user SET username = ?, name = ?, email = ?, role = ? WHERE id = ?', [
      username,
      name,
      email,
      role,
      id,
    ]);

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute('SELECT * FROM user WHERE id = ?', [id]);
    const updatedUser: UserType[] = rows.map(rowToCamelCase);

    await connection.commit();

    return updatedUser[0];
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to update user information', 500);
  } finally {
    connection.release();
  }
};

/** [관리자] 회원 정보 삭제 */
export const deleteUserById = async (id: number): Promise<void> => {
  try {
    await db.execute('UPDATE user SET activated = 0 WHERE id = ?', [id]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to delete user information', 500);
  }
};

/** [관리자] 회원이 작성한 일정 불러오기 */
export const getAllTravelPlansByUsername = async (username: string): Promise<TravelPlan[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM travel_plan WHERE username = ?', [
      username,
    ]);
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch user travel plans', 500);
  }
};

/** [관리자] 회원이 작성한 여행 장소 날짜 조회하기 */
export const getAllLocationsByPlanId = async (planId: number): Promise<TravelPlan[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      'SELECT * FROM travel_location WHERE plan_id = ?',
      [planId]
    );
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch user travel locations', 500);
  }
};

/** [관리자] 회원이 작성한 다이어리 조회하기 */
export const getAllDiariesByUsername = async (username: string): Promise<Diary[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute('SELECT * FROM travel_diary WHERE username = ?', [
      username,
    ]);
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch user travel diaries', 500);
  }
};

/** [관리자] 회원이 작성한 다이어리 삭제하기 */
export const deleteDiaryByUsernameAndDiaryId = async (username: string, diaryId: number): Promise<void> => {
  try {
    await db.execute('DELETE FROM travel_diary WHERE username = ? AND diary_id = ?', [username, diaryId]);
  } catch (error) {
    console.error(error);
    {
      throw new AppError(CommonError.UNEXPECTED_ERROR, '일정 삭제 실패했습니다.', 500);
    }
  }
};

/** [관리자] 회원이 작성한 다이어리 댓글 모두 조회하기 */
export const getAllCommentsByUsernameAndDiaryId = async (username: string, diaryId: number): Promise<Comment[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      'SELECT * FROM comment WHERE diary_id = ? AND username = ?',
      [diaryId, username]
    );
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch user diary comments', 500);
  }
};

/** [관리자] 특정 회원이 작성한 모든 댓글 조회하기 */
export const getAllCommentsByUsername = async (username: string): Promise<Comment[]> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `SELECT comment.*, travel_diary.title 
      FROM comment 
      LEFT JOIN travel_diary ON comment.diary_id = travel_diary.id 
      WHERE comment.username = ?`,
      [username]
    );
    return rows.map(rowToCamelCase);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to fetch user comments', 500);
  }
};

/** [관리자] 특정 회원이 작성한 댓글 삭제하기 */
export const deleteCommentByUsernameAndDiaryId = async (
  username: string,
  diaryId: number,
  commentId: number
): Promise<void> => {
  try {
    await db.execute('DELETE FROM comment WHERE username = ? AND diary_id = ? AND id = ?', [
      username,
      diaryId,
      commentId,
    ]);
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to delete comment', 500);
  }
};

/** [관리자] 관광지 추가 */
export const addTouristDestination = async (
  nameEn: string,
  nameKo: string,
  image: string,
  introduction: string,
  latitude: number,
  longitude: number
): Promise<void> => {
  try {
    let correctedImage = image.replace(/\\/g, '/');
    correctedImage = correctedImage.replace('http:/', 'http://');
    await db.execute(
      'INSERT INTO travel_destination (name_en, name_ko, image, introduction, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
      [nameEn, nameKo, correctedImage, introduction, latitude, longitude]
    );
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, '관광지 추가에 실패했습니다.', 500);
  }
};

/** [관리자] 관광지 수정하기 */
export const updateTouristDestination = async (id: string, product: Partial<TouristDestinationType>): Promise<void> => {
  try {
    await db.execute(
      'UPDATE travel_destination SET name_en = ?, name_ko = ?, image = ?, introduction = ? WHERE id = ?',
      [product.nameEn, product.nameKo, product.image, product.introduction, id]
    );
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to update tourist destination', 500);
  }
};

/** [관리자] 관광지 삭제하기 */
export const deleteTouristDestination = async (id: string): Promise<object> => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      `SELECT * FROM travel_destination WHERE id = ?`,
      [id]
    );
    const touristDestination = rowToCamelCase(rows[0]);

    await connection.execute(`DELETE FROM travel_destination WHERE id = ?`, [id]);

    await connection.commit();

    return touristDestination;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);
    throw new AppError(CommonError.SERVER_ERROR, 'Failed to delete tourist destination', 500);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

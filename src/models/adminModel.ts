import { UserType } from '../types/user';
import { db } from '../loaders/dbLoader';
import { TravelPlan } from '../types/travel';
import { DiaryType } from '../types/diary';
import { CommentType } from '../types/comment';

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

// [관리자] 회원이 작성한 일정 불러오기
export const getUserInfoTravelModel = async (user_id: string): Promise<TravelPlan[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM travel_plan WHERE user_id = ?', [user_id]);
    const travelPlans = rows as TravelPlan[];
    console.log(travelPlans);

    return travelPlans;
  } finally {
    connection.release();
  }
};

// [관리자] 회원이 작성한 여행 장소 날짜 조회하기
export const getUserInfoLocationModel = async (plan_id: number): Promise<TravelPlan[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM travel_location WHERE plan_id = ?', [plan_id]);
    const travelPlans = rows as TravelPlan[];
    console.log(travelPlans);

    return travelPlans;
  } finally {
    connection.release();
  }
};

// [관리자] 회원이 작성한 다이어리 조회하기
export const getUserInfoDiaryModel = async (user_id: string): Promise<DiaryType[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM travel_diary WHERE user_id = ?', [user_id]);
    const travelDiaries = rows as DiaryType[];
    console.log(travelDiaries);

    return travelDiaries;
  } finally {
    connection.release();
  }
};

// [관리자] 회원이 작성한 다이어리 댓글 모두 조회하기
export const getUserInfoDiaryCommentModel = async (user_id: string, diary_id: number): Promise<CommentType[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM comment WHERE diary_id = ? AND user_id = ?', [
      diary_id,
      user_id,
    ]);
    const diaryComments = rows as CommentType[];
    console.log(diaryComments);

    return diaryComments;
  } finally {
    connection.release();
  }
};

// [관리자] 특정 회원이 작성한 모든 댓글 조회하기 ( LEFT JOIN을 통해서 다이어리 제목도 함께 조회 )
export const getUserAllCommentModel = async (user_id: string): Promise<CommentType[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT comment.*, travel_diary.title ' +
      'FROM comment ' +
      'LEFT JOIN travel_diary ON comment.diary_id = travel_diary.diary_id ' +
      'WHERE comment.user_id = ?',
      [user_id]
    );
    const userComments = rows as CommentType[];
    console.log(userComments);

    return userComments;
  } finally {
    connection.release();
  }
};
import { UserType } from '../types/user';
import { db } from '../loaders/dbLoader';
import { TravelPlan } from '../types/travel';
import { DiaryType } from '../types/diary';
import { CommentType } from '../types/comment';

// [관리자] 모든 회원 정보 불러오기
export const getAllUsersModel = async (): Promise<UserType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM user');
    return rows as UserType[];
  } catch (error) {
    console.error(error);
    throw new Error('모든 회원 정보를 불러오는 중에 오류가 발생했습니다.');
  }
};

// [관리자] 회원 정보 업데이트
export const updateUserByIdModel = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  try {
    await db.query('UPDATE user SET ? WHERE id = ?', [user, id]);
    const [rows] = await db.execute('SELECT * FROM user WHERE id = ?', [id]);
    const [updatedUser] = rows as UserType[];
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw new Error('회원 정보 업데이트 중에 오류가 발생했습니다.');
  }
};

// [관리자] 회원 정보 삭제
export const deleteUserByIdModel = async (id: number): Promise<void> => {
  try {
    await db.execute('UPDATE user SET activated = 0 WHERE id = ?', [id]);
  } catch (error) {
    console.error(error);
    throw new Error('회원 정보 삭제 중에 오류가 발생했습니다.');
  }
};

// [관리자] 회원이 작성한 일정 불러오기
export const getUserInfoTravelModel = async (user_id: string): Promise<TravelPlan[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_plan WHERE user_id = ?', [user_id]);
    const travelPlans = rows as TravelPlan[];
    console.log(travelPlans);

    return travelPlans;
  } catch (error) {
    console.error(error);
    throw new Error('회원이 작성한 일정을 불러오는 중에 오류가 발생했습니다.');
  }
};

// [관리자] 회원이 작성한 여행 장소 날짜 조회하기
export const getUserInfoLocationModel = async (plan_id: number): Promise<TravelPlan[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_location WHERE plan_id = ?', [plan_id]);
    const travelPlans = rows as TravelPlan[];
    console.log(travelPlans);

    return travelPlans;
  } catch (error) {
    console.error(error);
    throw new Error('회원이 작성한 여행 장소 날짜를 조회하는 중에 오류가 발생했습니다.');
  }
};

// [관리자] 회원이 작성한 다이어리 조회하기
export const getUserInfoDiaryModel = async (user_id: string): Promise<DiaryType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM travel_diary WHERE user_id = ?', [user_id]);
    const travelDiaries = rows as DiaryType[];
    console.log(travelDiaries);

    return travelDiaries;
  } catch (error) {
    console.error(error);
    throw new Error('회원이 작성한 다이어리를 조회하는 중에 오류가 발생했습니다.');
  }
};

// [관리자] 회원이 작성한 다이어리 삭제하기
export const deleteDiaryByAdminModel = async (user_id: string, diary_id: number): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('DELETE FROM travel_diary WHERE user_id = ? AND diary_id = ?', [user_id, diary_id]);
  } finally {
    connection.release();
  }
};

// [관리자] 회원이 작성한 다이어리 댓글 모두 조회하기
export const getUserInfoDiaryCommentModel = async (
  user_id: string,
  diary_id: number
): Promise<CommentType[]> => {
  try {
    const [rows] = await db.execute('SELECT * FROM comment WHERE diary_id = ? AND user_id = ?', [
      diary_id,
      user_id,
    ]);
    const diaryComments = rows as CommentType[];
    console.log(diaryComments);

    return diaryComments;
  } catch (error) {
    console.error(error);
    throw new Error('회원이 작성한 다이어리 댓글을 조회하는 중에 오류가 발생했습니다.');
  }
};

// [관리자] 특정 회원이 작성한 모든 댓글 조회하기 ( LEFT JOIN을 통해서 다이어리 제목도 함께 조회 )
export const getUserAllCommentModel = async (user_id: string): Promise<CommentType[]> => {
  try {
    const [rows] = await db.execute(
      'SELECT comment.*, travel_diary.title ' +
        'FROM comment ' +
        'LEFT JOIN travel_diary ON comment.diary_id = travel_diary.diary_id ' +
        'WHERE comment.user_id = ?',
      [user_id]
    );
    const userComments = rows as CommentType[];
    console.log(userComments);

    return userComments;
  } catch (error) {
    console.error(error);
    throw new Error('특정 회원이 작성한 모든 댓글을 조회하는 중에 오류가 발생했습니다.');
  }
};

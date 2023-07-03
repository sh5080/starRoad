import * as adminModel from '../models/adminModel';
import { TravelPlan } from '../types/travel';
import { UserType } from '../types/user';
import { Diary } from '../types/diary';
import { Comment } from '../types/comment';
import { AppError, CommonError } from '../types/AppError';
import { TouristDestinationType } from '../types/destination';

interface TouristDestination {
  [key: string]: any;
}
interface DeletedData {
  touristDestination: TouristDestination;
  message: string;
  [key: string]: any;
}

/** [관리자] 모든 회원 정보 불러오기 */
export const getAllUsers = async (): Promise<UserType[]> => {
  try {
    const allUserData = await adminModel.getAllUsers();
    return allUserData;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '회원 정보 불러오기에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 회원 정보 불러오기 */
export const getUser = async (id: number): Promise<UserType> => {
  try {
    const userData = await adminModel.getUser(id);
    if (!userData) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '해당하는 회원이 없습니다.', 404);
    }
    return userData;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '회원정보 불러오기에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 회원 정보 업데이트 */
export const updateUser = async (id: number, user: Partial<UserType>): Promise<UserType> => {
  try {
    if (!user || Object.keys(user).length === 0) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 사용자 정보가 제공되지 않았습니다.', 400);
    }
    const updatedUser = await adminModel.updateUserById(id, user);
    return updatedUser;
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

// [관리자] 회원 정보 삭제
export const deleteUser = async (id: number) => {
  try {
    await adminModel.deleteUserById(id);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.SERVER_ERROR, '회원정보 삭제에 실패했습니다.', 500);
    }
  }
};
/** [관리자] 회원이 작성한 여행 일정 조회하기 */
export const getAllTravelPlansByUsername = async (username: string): Promise<TravelPlan[]> => {
  try {
    if (!username) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 사용자 정보가 제공되지 않았습니다.', 400);
    }
    const travelPlans = await adminModel.getAllTravelPlansByUsername(username);
    if (!travelPlans) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 일정을 찾을 수 없습니다.', 404);
    }

    return travelPlans;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '일정 조회에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 회원이 작성한 여행 장소 날짜 조회하기 */
export const getAllLocationsByPlanId = async (planId: number): Promise<TravelPlan[]> => {
  try {
    if (!planId) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 여행 일정 정보가 제공되지 않았습니다.', 400);
    }

    const travelPlans = await adminModel.getAllLocationsByPlanId(planId);
    if (!travelPlans) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 장소를 찾을 수 없습니다.', 404);
    }

    return travelPlans;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '여행 장소, 날짜 조회에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 회원이 작성한 여행기 조회하기 */
export const getAllDiariesByUsername = async (username: string): Promise<Diary[]> => {
  try {
    if (!username) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 사용자 정보가 제공되지 않았습니다.', 400);
    }

    const travelDiaries = await adminModel.getAllDiariesByUsername(username);
    if (!travelDiaries) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기를 찾을 수 없습니다.', 404);
    }

    return travelDiaries;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 조회에 실패했습니다.', 500);
    }
  }
};

// [관리자] 회원이 작성한 여행기 삭제하기
export const deleteDiaryByUsernameAndDiaryId = async (diaryId: number) => {
  try {
    if (!diaryId) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 사용자 정보가 제공되지 않았습니다.', 400);
    }

    await adminModel.deleteDiaryByUsernameAndDiaryId(diaryId);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '여행기 삭제에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 회원이 작성한 여행기의 모든 댓글 조회하기 */
export const getAllCommentsByUsernameAndDiaryId = async (username: string, diaryId: number): Promise<Comment[]> => {
  try {
    if (!username || !diaryId) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 사용자 정보가 제공되지 않았습니다.', 400);
    }

    const diaryComments = await adminModel.getAllCommentsByUsernameAndDiaryId(username, diaryId);
    if (!diaryComments[0]) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행기 댓글을 찾을 수 없습니다.', 404);
    }
    return diaryComments;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '해당 여행기의 모든 댓글 조회에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 특정 회원이 작성한 모든 댓글 조회하기 */
export const getAllCommentsByUsername = async (username: string): Promise<Comment[]> => {
  try {
    if (!username) {
      throw new AppError(CommonError.INVALID_INPUT, '올바른 사용자 정보가 제공되지 않았습니다.', 400);
    }

    const userComments = await adminModel.getAllCommentsByUsername(username);
    if (!userComments) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '사용자 댓글을 찾을 수 없습니다.', 404);
    }
    return userComments;
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '특정 사용자의 댓글 조회에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 회원이 작성한 댓글 삭제하기 */
export const deleteComment = async (commentId: number) => {
  try {
    const deletedComment = await adminModel.deleteComment(commentId);
    if (deletedComment===undefined) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '삭제할 댓글이 없습니다.', 404);
    }
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '댓글 삭제에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 관광지 추가하기 */
export const addTouristDestination = async (
destinationData: TouristDestinationType
) => {
  try {
    await adminModel.addTouristDestination(destinationData);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '관광지 추가에 실패했습니다.', 500);
    }
  }
};


/** [관리자] 관광지 수정하기 */
export const getTouristDestinationImage = async (id:string) => {
  const originImage = await adminModel.getTouristDestinationImage(id);
  if (!originImage) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '관광지를 찾을 수 없습니다.', 400);
  }
  return originImage
}
export const updateTouristDestination = async (id: string, updatedData: Partial<TouristDestinationType>) => {
  try {
    await adminModel.updateTouristDestination(id, updatedData);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '관광지 수정에 실패했습니다.', 500);
    }
  }
};

/** [관리자] 관광지 삭제하기 */
export const deleteTouristDestination = async (id: string): Promise<DeletedData> => {
  try {
    const touristDestination = await adminModel.deleteTouristDestination(id);
    if (!touristDestination) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '이미 삭제되었거나 없는 관광지입니다.', 404);
    }
    return { message: '관광지 삭제에 성공하였습니다.', touristDestination };
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error);
      throw error;
    } else {
      console.error(error);
      throw new AppError(CommonError.UNEXPECTED_ERROR, '관광지 삭제에 실패했습니다.', 500);
    }
  }
};

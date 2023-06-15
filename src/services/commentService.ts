import * as commentModel from '../models/commentModel';
import { Comment } from '../types/comment';
import { AppError, CommonError } from '../types/AppError';

/**
 * 댓글 생성
 */
export const createComment = async (comment: Comment): Promise<void> => {
  try {
    const { username, diaryId, comment: commentText } = comment;

    await commentModel.createComment({ username, diaryId, comment: commentText });
  } catch (error) {
    console.error(error);
  }
};

/**
 * 게시물별 댓글 조회
 */
export const getCommentsByDiary = async (
  diaryId: number,
  page: number,
  limit: number
): Promise<Comment[]> => {
  const comments = await commentModel.getCommentsByDiary(diaryId, page, limit); // pagination 적용
  return comments;
};

/**
 * 댓글 수정
 */
export const updateComment = async (newComment: Comment, id: number, username: string) => {
  const existingComment = await commentModel.getComment(id);
  if (!existingComment) {
    throw new AppError(CommonError.INVALID_INPUT, '존재하지 않는 댓글입니다.', 404);
  }

  if (existingComment.username !== username) {
    throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '댓글을 수정할 권한이 없습니다.', 403);
  }

  await commentModel.updateComment(id, newComment);
  return existingComment;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (id: number, username: string) => {
  const comment = await commentModel.getComment(id);
  if (!comment) {
    throw new AppError(CommonError.RESOURCE_NOT_FOUND, '댓글을 찾을 수 없습니다.', 404);
  }
  if (comment.username !== username) {
    throw new AppError(CommonError.UNAUTHORIZED_ACCESS, '권한이 없습니다.', 403);
  }
  await commentModel.deleteComment(id);
  return '댓글 삭제가 완료되었습니다.';
};

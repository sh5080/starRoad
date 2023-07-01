import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from './customRequest';
// controller.d.ts

/**
 * 회원가입
 * @param req.body name: 이름, username: 사용자 ID, password: 패스워드, email: 이메일
 * @param res name, username, email 회원정보  JSON 형식으로 응답
 * @throws {AppError} 아이디 비밀번호 유효성 검증 실패할 경우
 * @param next 다음 미들웨어 함수 (errorHandler)
 */
export declare function signup(req: Request, res: Response, next: NextFunction): Promise<void>;

/**
 * 로그인
 * @param req.body username: 사용자 ID, password: 패스워드
 * @param res 로그인이 성공한 경우 토큰을 쿠키에 담아 JSON 형식으로 응답
 * @throws {AppError} 탈퇴한 회원에 대한 접근 또는 인증 오류가 발생한 경우
 * @param next 다음 미들웨어 함수 (errorHandler)
 */
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;

/**
 * 로그아웃
 * @param res 토큰값
 * @param next 다음 미들웨어 함수 (errorHandler)
 */
export declare function logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 내 정보 조회
 * @param req.user.username 사용자 ID 정보
 * @param res 사용자 정보를 성공적으로 가져올 경우 해당 정보를 JSON 형식으로 응답
 * @throws {AppError} 사용자를 찾을 수 없는 경우 (RESOURCE_NOT_FOUND)
 * @param next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function getUserInfo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 회원 정보 수정
 * @param req.user username: 사용자 ID
 * @param req.body 수정할 이메일 및 비밀번호
 * @param res 수정된 회원 정보를 JSON 형식으로 응답
 * @throws {AppError} 비밀번호가 유효성 검사에 통과하지 못한 경우 (INVALID_INPUT)
 * @param next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function updateUserInfo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 회원 탈퇴
 * @param req.user username: 사용자 ID
 * @param res 회원 탈퇴가 성공한 경우 토큰을 제거하고 탈퇴한 회원의 정보를 JSON 형식으로 응답
 * @throws {AppError} 탈퇴한 회원에 대한 접근 또는 회원이 존재하지 않는 경우 (RESOURCE_NOT_FOUND)
 * @param next 다음 미들웨어 함수 (errorHandler)
 */
export declare function deleteUserInfo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 여행 일정 작성
 * @param {CustomRequest} req.body 작성할 여행 일정 정보 dates, startDate, endDate, destination
 * @example req.body.dates 
 * "date": "2023-12-01", 
 * "locations": 
 * [{
"location": "test서울",
"latitude": 37.5665,
"longitude": 126.9780,
"order": 1
}]
 * @param {CustomRequest} req.user username: 사용자 ID
 * @param {Response} res 작성된 여행 일정 정보 startDate,endDate,destination,username,dates를 JSON 형식으로 응답
 * @throws {AppError} 유효하지 않은 날짜 또는 날짜 범위, 필수 정보 누락 등 유효성 검사 실패 시 (INVALID_INPUT)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function createTravelPlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 모든 여행 일정 조회
 * @param {CustomRequest} req.user username: 사용자 ID
 * @param {Response} res 조회된 여행 일정 정보를 JSON 형식으로 응답
 * @example
{
"travelPlanData": {
 * "planId": 439,
        "username": "test123123",
        "startDate": "2023-11-30T15:00:00.000Z",
        "endDate": "2023-12-01T15:00:00.000Z",
        "destination": "test123",
        "createdAt": "2023-06-27T20:28:52.000Z",
        "updatedAt": "2023-06-27T20:28:52.000Z",
        "dates": [
            {
        "date": "Wed Nov 01 2023 00:00:00 GMT+0900 (대한민국 표준시)",
                "locations": [
                    {
                        "locationId": 1042,
                        "planId": 439,
                        "date": "2023-10-31T15:00:00.000Z",
                        "location": "수정된 test서울",
                        "order": 1,
                        "latitude": "37.56650000",
                        "longitude": "126.97800000"
                    }
                ]
            }
            ]
    }
}
 * @throws {AppError} 조회된 여행 일정이 없는 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function getTravelPlansByUsername(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 유저의 여행 일정 상세 조회
 * @param {CustomRequest} req.params 조회할 여행 일정의 ID
 * @param {Response} res 조회된 여행 일정의 상세 정보를 JSON 형식으로 응답
 * @throws {AppError} 조회된 여행 일정이 없는 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function getTravelPlanDetailsByPlanId(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void>;

export declare function getTravelPlansByUsername(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

export declare function getTravelPlansByUsername(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

export declare function getTravelPlansByUsername(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

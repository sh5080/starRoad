import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from './customRequest';

// userController -----------------------------------------------------------------------------
/**
 * 회원가입
 * @param req.body name: 이름, username: 사용자 ID, password: 패스워드, email: 이메일
 * @param res exceptPassword: name, username, email 회원정보 JSON 형식으로 응답
 * @throws {AppError} 아이디 비밀번호 유효성 검증 실패할 경우
 * @param next 다음 미들웨어 함수 (errorHandler)
 */
export declare function signup(req: Request, res: Response, next: NextFunction): Promise<void>;

/**
 * 로그인
 * @param req.body username: 사용자 ID, password: 패스워드
 * @param res userData: 로그인이 성공한 경우 토큰을 쿠키에 담아 JSON 형식으로 응답
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
 * @param res userData: 사용자 정보를 성공적으로 가져올 경우 해당 정보를 JSON 형식으로 응답
 * @throws {AppError} 사용자를 찾을 수 없는 경우 (RESOURCE_NOT_FOUND)
 * @param next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function getUserInfo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 회원 정보 수정
 * @param req.user.username 사용자 ID
 * @param req.body 수정할 이메일 및 비밀번호
 * @param res updatedUserData 수정된 회원 정보를 JSON 형식으로 응답
 * @throws {AppError} 비밀번호가 유효성 검사에 통과하지 못한 경우 (INVALID_INPUT)
 * @param next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function updateUserInfo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 회원 탈퇴
 * @param req.user.username 사용자 ID
 * @param res responseData 회원 탈퇴가 성공한 경우 토큰을 제거하고 탈퇴한 회원의 정보를 JSON 형식으로 응답
 * @throws {AppError} 탈퇴한 회원에 대한 접근 또는 회원이 존재하지 않는 경우 (RESOURCE_NOT_FOUND)
 * @param next 다음 미들웨어 함수 (errorHandler)
 */
export declare function deleteUserInfo(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//travelController -----------------------------------------------------------------------------
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
 * @param {CustomRequest} req.user.username 사용자 ID
 * @param {Response} res responseData: 작성된 여행 일정 정보 startDate,endDate,destination,username,dates를 JSON 형식으로 응답
 * @example
{
    "startDate": "2023-12-01",
    "endDate": "2023-12-02",
    "destination": "test123",
    "username": "test123123",
    "dates": [
        {
            "date": "2023-12-01",
            "locations": [
                {
                    "location": "test서울",
                    "latitude": 37.5665,
                    "longitude": 126.978,
                    "order": 1,
                    "date": "2023-12-01"
                },
                {
                    "location": "test대구",
                    "latitude": 35.1796,
                    "longitude": 129.0756,
                    "order": 2,
                    "date": "2023-12-01"
                }
            ]
        },
        {
            "date": "2023-12-02",
            "locations": [
                {
                    "location": "test부산",
                    "latitude": 37.4563,
                    "longitude": 126.7052,
                    "order": 1,
                    "date": "2023-12-02"
                }
            ]
        }
    ]
}
 * @throws {AppError} 유효하지 않은 날짜 또는 날짜 범위, 필수 정보 누락 등 유효성 검사 실패 시 (INVALID_INPUT)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function createTravelPlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 모든 여행 일정 조회
 * @param {CustomRequest} req.user.username 사용자 ID
 * @param {Response} res travelPlanData: 조회된 여행 일정 정보를 JSON 형식으로 응답
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
 * @param {CustomRequest} req.params.planId 조회할 여행 일정의 ID
 * @param {Response} res travelPlanData: 조회된 여행 일정의 상세 정보를 JSON 형식으로 응답 (모든 여행 일정 조회 travelPlanData example 참고)
 * @throws {AppError} 조회된 여행 일정이 없는 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function getTravelPlanDetailsByPlanId(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void>;

/**
 * 여행 일정의 날짜별 장소 수정
 * @param {CustomRequest} req.params.planId 수정할 여행 일정의 ID
 * @param {CustomRequest} req.body dates: 수정된 장소 정보
 * @param {CustomRequest} req.user username: 사용자 ID
 * @example
{
    "dates": [
        {
            "date": "2023-11-01",
            "locations": [
                {
                    "locationId": 1042,
                    "planId": 439,
                    "location": "수정된 test서울",
                    "newDate": "2023-10-31T15:00:00.000Z",
                    "order": 1,
                    "latitude": "37.56650000",
                    "longitude": "126.97800000"
                }
            ]
        }
    ]
}
 * @param {Response} res dates: 수정된 장소 정보를 JSON 형식으로 응답 (req.body)
 * @throws {AppError} 유효하지 않은 날짜 또는 장소 정보, 필수 정보 누락 등 유효성 검사 실패 시 (INVALID_INPUT)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function updateTravelPlanAndLocation(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void>;

/**
 * 여행 일정 삭제
 * @param {CustomRequest} req.user.username 사용자 ID
 * @param {CustomRequest} req.params.planId 삭제할 여행 일정의 ID
 * @param {Response} res deletedPlan: 삭제된 여행 일정 정보를 JSON 형식으로 응답
 * @example
{
    "deletedPlan": [
        {
            "planId": 439,
            "username": "test123123",
            "startDate": "2023-11-30T15:00:00.000Z",
            "endDate": "2023-12-01T15:00:00.000Z",
            "destination": "test123",
            "createdAt": "2023-06-27T20:28:52.000Z",
            "updatedAt": "2023-06-27T20:28:52.000Z"
        }
    ],
    "deletedLocations": [
        {
            "locationId": 1040,
            "planId": 439,
            "date": "2023-11-30T15:00:00.000Z",
            "location": "test서울",
            "order": 1,
            "latitude": "37.56650000",
            "longitude": "126.97800000"
        }
    ]
}
 * @throws {AppError} 이미 삭제된 일정이거나 없는 일정인 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러) 
*/
export declare function deleteTravelPlan(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//diaryController -----------------------------------------------------------------------------
/**
 * 권한 확인 미들웨어
 * @param {CustomRequest} req.params.planId 일정 ID
 * @param {CustomRequest} req.user.username 사용자 ID
 * @throws {AppError} 권한이 없는 경우 (UNAUTHORIZED_ACCESS)
 * @param {NextFunction} next 다음 미들웨어 함수 (processImage 이미지업로드 (multer))
 * {@link https://github.com/expressjs/multer/blob/master/doc/README-ko.md} multer github
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function checkAuthorization(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 여행기 작성
 * @param {CustomRequest} req.body title: 작성할 여행기 제목, content: 작성할 여행기 본문
 * @param {CustomRequest} req.params.plnaId 일정ID
 * @param {CustomRequest} req.user.username username: 사용자ID
 * @param {CustomRequest} req.files multer에서 업로드한 파일, 최대 4장 업로드 가능
 * (property) Express.Request.files?: {
    [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[]
 * {@link https://github.com/expressjs/multer/blob/master/doc/README-ko.md} multer github
 * @param {Response} res diaryData: 작성된 여행기 정보를 JSON 형식으로 응답
@example
{
    "username": "test1",
    "title": "여행기 제목1",
    "content": "여행기 본문1",
    "image": [
        "http://localhost:3000/static/compressed/이미지 파일명1.png",
        "http://localhost:3000/static/compressed/이미지 파일명2.png"
    ],
    "destination": "Seoul"
}
 * @throws {AppError} 이미지 파일이 첨부되지 않은 경우 또는 필수 정보 누락 시 (RESOURCE_NOT_FOUND, BAD_REQUEST)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
*/
export declare function createDiary(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 전체 여행기 조회
 * @param {Response} res diaryData: 조회된 전체 여행기 정보를 JSON 형식으로 응답
 * @example
[
    {
        "id": 230,
        "username": "test123",
        "plan_id": 434,
        "title": "여행기 제목1",
        "content": "여행기 본문1",
        "image": "image.jpg",
        "destination": "대전",
        "created_at": "2023-06-04T17:09:29.000Z",
        "updated_at": "2023-06-04T17:09:29.000Z"
    }
]
 * @throws {AppError} 전체 여행기가 없는 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
*/
export declare function getAllDiaries(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 내 여행기 조회
 * @param {CustomRequest} req.user.username 사용자 ID
 * @param {Response} res diaryData: 조회된 내 여행기 정보를 JSON 형식으로 응답(전체 여행기 조회 참고)
 * @throws {AppError} 여행기가 없는 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)

 */
export declare function getMyDiaries(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 특정 여행기 조회
 *
 * @param {number} req.params.diaryId 여행기 ID
 * @param {Response} res diaryData: 조회된 여행기 정보를 JSON 형식으로 응답(전체 여행기 조회 참고)
 * @throws {AppError} 해당 여행기를 찾을 수 없는 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next - 다음 미들웨어 함수(에러 핸들러)
*/
export declare function getOneDiaryByDiaryId(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 여행기 수정
 *
 * @param {number} req.params.diaryId 여행기 ID
 * @param {string} req.body title: 제목, content: 내용
 * @param {CustomRequest} req.user.username username: 사용자 ID
 * @param {CustomRequest} req.files multer에서 업로드한 파일, 최대 4장 업로드 가능
 * (property) Express.Request.files?: {
    [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[]
 * {@link https://github.com/expressjs/multer/blob/master/doc/README-ko.md} multer github
 * @param {Response} res diaryData: 조회된 여행기 정보를 JSON 형식으로 응답(전체 여행기 조회 참고)
 * @throws {AppError} 해당 다이어리를 찾을 수 없는 경우 (RESOURCE_NOT_FOUND)
 * @param {NextFunction} next - 다음 미들웨어 함수
*/
export declare function updateDiary(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 여행기 삭제
 *
 * @param {number} req.params.diaryId 여행기 ID
 * @param {CustomRequest} req.user.username 사용자 ID
 * @param {Response} res diaryData: 조회된 여행기 정보를 JSON 형식으로 응답(전체 여행기 조회 참고)
 * @throws {AppError} 이미지 삭제 실패 또는 해당 여행기를 찾을 수 없는 경우
 * @param {NextFunction} next - 다음 미들웨어 함수(에러 핸들러)
*/
export declare function deleteDiary(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//destinationController -----------------------------------------------------------------------------

/**
 * 관광지 모두 조회하기
 *
 * @param {Response} res data:{destinations, destinationCount} 관광지 정보, 업로드한 관광지 수를 JSON 형식으로 응답
 * @example
destinations: [
  {
    id: 182,
    nameEn: 'SEOUL',
    nameKo: '서울',
    image: '서울.jpg',
    introduction: '서울은 대한민국의 수도이자 가장 큰 도시로, 아시아에서 가장 현대적이고 역동적인 도시 중 하나입니다. 다양한 관광 명소, 문화적인 경험, 풍부한 음식 문화, 쇼핑, 엔터테인먼트 등을 제공하여 많은 여행객들이 매년 방문하고 있습니다. 서울의 대표적인 관광지로는 남산 타워가 있습니다. 서울의 아름다운 전경을 조망할 수 있으며, 근처에는 남산 공원이 있어 산책이나 피크닉을 즐길 수 있습니다. 또한, 한강을 따라 자전거를 타거나 워터스포츠를 즐길 수 있는 한강 공원도 인기 있는 관광지 중 하나입니다.',
    latitude: '37.565383',
    longitude: '126.978483'
  }
],
destinationCount: 12
 * @param {NextFunction} next - 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function getAllTouristDestination(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 관광지 상세 조회하기
 *
 * @param {string} req.params.locationId 위치 ID
 * @param {Response} res destination: 관광지 정보(관광지 모두 조회하기 destination 참고)를 JSON 형식으로 응답
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getTouristDestination(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//commentController  -----------------------------------------------------------------------------

/**
 * 댓글 생성
 * 
 * @param {CustomRequest} req.body diaryId: 여행기 ID, comment: 댓글 내용
 * @param {Response} res diaryId, comment 생성된 여행기 ID와 댓글 내용을 JSON 형식으로 응답
 * @example {
    "diaryId": 281,
    "comment": "댓글 테스트"
}
 * @throws {AppError} 유효하지 않은 여행기일 경우 에러 발생
 * @param {NextFunction} next - 다음 미들웨어 함수(에러 핸들러)
 */
export declare function createComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 여행기에 대한 댓글 조회
 *
 * @param {string} req.params.diaryId 여행기 ID
 * @param {string} req.query.page 페이지 번호 ex) comments/diary/4?page=1
 * @param {Response} res comments 댓글 내용을 JSON 형식으로 응답
 * @throws {AppError} 해당 댓글 찾을 수 없는 경우
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getCommentsByDiaryId(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 댓글 수정
 *
 * @param {string} req.params.commentId 댓글 ID
 * @param {string} req.body.comment 수정할 댓글 내용
 * @param {CustomRequest} req.user.username 사용자 ID
 * @param {Response} res 댓글 내용을 JSON 형식으로 응답
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function updateComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 댓글 삭제
 *
 * @param {string} req.params.commentId 댓글 ID
 * @param {CustomRequest} req.user.username 사용자 ID
 * @param {Response} res message: '댓글 삭제가 완료되었습니다.'를 JSON 형식으로 응답
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function deleteComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

export declare function updateComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

export declare function updateComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

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
 * 권한 확인 미들웨어
 * @param {CustomRequest} req.params.diaryId 여행기 ID
 * @param {CustomRequest} req.user.username 사용자 ID
 * @throws {AppError} 권한이 없는 경우 (UNAUTHORIZED_ACCESS)
 * @param {NextFunction} next 다음 미들웨어 함수 (processImage 이미지업로드 (multer))
 * {@link https://github.com/expressjs/multer/blob/master/doc/README-ko.md} multer github
 * @param {NextFunction} next 다음 미들웨어 함수 (에러 핸들러)
 */
export declare function checkAuthorizationForUpdate(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

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
 * @throws {AppError} 해당 여행기를 찾을 수 없는 경우 (RESOURCE_NOT_FOUND)
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

//authController ----------------------------------------------------------------------------------------------
/**
 * 카카오 로그인 콜백
 *
 * @param {string} req.query.code 카카오 로그인 인가코드
 * @param {Response} res.cookie
 *                        - httpOnly: true/false (클라이언트 스크립트에서 쿠키를 읽지 못하게 할지 여부)
 *                        - secure: true/false (HTTPS 연결에서만 쿠키를 전송할지 여부)
 *                        - maxAge: number (쿠키의 유효 기간, 밀리초 단위)
 * @param {Response} res.redirect
 *                        리다이렉트는 클라이언트를 다른 URL로 이동시키는 작업을 의미합니다.
 *                        이 작업은 `res.redirect(URL)` 형태로 수행됩니다.
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function kakaoCallback(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * 구글 로그인 콜백
 *
 * @param {string} req.query.code 구글 로그인 인가코드
 * @param {Response} res.cookie
 *                        - httpOnly: true/false (클라이언트 스크립트에서 쿠키를 읽지 못하게 할지 여부)
 *                        - secure: true/false (HTTPS 연결에서만 쿠키를 전송할지 여부)
 *                        - maxAge: number (쿠키의 유효 기간, 밀리초 단위)
 * @param {Response} res.redirect
 *                        리다이렉트는 클라이언트를 다른 URL로 이동시키는 작업을 의미합니다.
 *                        이 작업은 `res.redirect(URL)` 형태로 수행됩니다.
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function googleCallback(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//adminController ----------------------------------------------------------------------------------------------

//user 관련
/**
 * [관리자] 모든 회원 조회하기
 *
 * @param {Response} res users: 모든 회원 정보를 JSON 형식으로 응답 role: 관리자 여부 activated: 가입/탈퇴여부, oauthProvider: 가입방식, userCount: 조회된 전체 회원 수
 * @example
{
    "data": {
        "users": [
            {
                "id": 123,
                "username": "test1",
                "name": "test",
                "email": "test@test.com",
                "createdAt": "2023-06-04T13:28:52.000Z",
                "updatedAt": "2023-06-18T04:20:45.000Z",
                "role": "ADMIN",
                "activated": 1,
                "oauthProvider": "origin"
            }
        ]
        "userCount": 81,
        "message": "모든 회원을 불러왔습니다."
    }
}
 * @throws {AppError} 불러올 회원 정보(users)가 없는 경우
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getAllUsers(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * [관리자] 특정 회원 조회하기
 *
 * @param {number} req.params.id 조회할 회원 고유 ID값
 * @param {Response} res user: 회원 정보를 JSON 형식으로 응답(모든 회원 조회하기 users 참고)
 * @throws {AppError} id값 유효성 검증 오류
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * [관리자] 회원 정보 업데이트
 *
 * @param {number} req.params.id 회원 고유 ID값
 * @param {string} req.body.username 사용자 ID
 * @param {string} req.body.name 수정할 회원 이름
 * @param {string} req.body.email 수정할 회원 이메일
 * @param {string} req.body.role 수정할 회원 권한 (user/admin)
 * @param {Response} res 수정한 회원정보를 JSON 형식으로 응답
 * @example {
    "data": {
        "id": 145,
        "username": "updatedtest1",
        "name": "updatedtest",
        "email": "test@gmail.com",
        "createdAt": "2023-06-30T06:12:10.000Z",
        "updatedAt": "2023-07-02T02:48:22.000Z",
        "role": "user",
        "activated": 1,
        "oauthProvider": kakao
    },
    "message": "회원 정보 수정을 완료했습니다."
}
 * @throws {AppError} id, role 유효성 검증, 존재 여부 오류
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function updateUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * [관리자] 회원 정보 삭제
 *
 * @param {number} req.params.id 회원 고유 ID값
 * @param {Response} res 삭제한 회원 정보를 JSON 형식으로 응답
 * @throws {AppError} id 유효성 검증 오류
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function deleteUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//travel 관련
/**
 * [관리자] 회원이 작성한 여행 일정 조회하기
 *
 * @param {CustomRequest} req.params.username 사용자 ID
 * @param {Response} res 여행 일정을 JSON 형식으로 응답
 * @example
{
    "data": [
        {
            "planId": 323,
            "username": "test1",
            "startDate": "2023-06-03T15:00:00.000Z",
            "endDate": "2023-06-22T15:00:00.000Z",
            "destination": "{\"id\":158,\"nameEn\":\"SEOUL\",\"nameKo\":\"서울\",\"image\":\"http://domain/static/compressed/test.jpg\",\"introduction\":\"서울은...\",\"latitude\":\"37.121210\",\"longitude\":\"121.112115\"}",
            "createdAt": "2023-06-16T07:46:00.000Z",
            "updatedAt": "2023-06-16T07:46:00.000Z"
        },
    ],
    "message": "회원이 작성한 여행 일정을 조회했습니다."
}
 * @throws {AppError} username 유효성 검증 오류
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getAllTravelPlansByUsername(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void>;

/**
 * [관리자] 회원이 작성한 날짜 장소 조회하기
 *
 * @param {CustomRequest} req.params.planId 여행 일정 ID
 * @param {Response} res 회원이 작성한 날짜별 장소를 JSON 형식으로 응답
 * @example
{
    "data": [
        {
            "locationId": 632,
            "planId": 325,
            "date": "2023-06-04T15:00:00.000Z",
            "location": "제주특별자치도 서귀포시 보목동",
            "order": 1,
            "latitude": "33.24127212",
            "longitude": "126.59230607"
        }
    ],
    "message": "회원이 작성한 날짜별 장소를 조회했습니다."
}
 * @throws {AppError} planId 유효성 검증 오류
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getAllLocationsByPlanId(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//diary 관련
/**
 * [관리자] 회원이 작성한 여행기 모두 조회하기
 *
 * @param {CustomRequest} req.params.username 사용자 ID
 * @param {Response} res 여행기 정보를 JSON 형식으로 응답
 * @example
{
    "data": [
        {
            "id": 423,
            "planId": 456,
            "title": "테스트1",
            "content": "본문1",
            "image": "[\"http://domain/static/compressed/image.png\"]",
            "destination": "{\"id\":158,\"nameEn\":\"SEOUL\",\"nameKo\":\"서울\",\"image\":\"http://domain/static/compressed/image.jpg\",\"introduction\":\"서울은...\",\"latitude\":\"37.121210\",\"longitude\":\"121.112115\"}",
            "createdAt": "2023-07-02T04:28:37.000Z",
            "updatedAt": "2023-07-02T04:28:37.000Z"
        }
    ],
    "message": "회원이 작성한 여행기를 조회했습니다."
}
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getAllDiariesByUsername(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * [관리자] 회원이 작성한 여행기 삭제하기
 *
 * @param {CustomRequest} req.params.diaryId 여행기 ID
 * @param {Response} res 삭제된 diaryId를 JSON 형식으로 응답
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function deleteDiaryByUsernameAndDiaryId(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//comment 관련
/**
 * [관리자] 회원이 작성한 여행기의 댓글 모두 조회하기
 *
 * @param {CustomRequest} req.params.username 사용자 ID
 * @param {CustomRequest} req.params.diaryId 여행기 ID
 * @param {Response} res 댓글 정보를 JSON 형식으로 응답
 * @example
{
    "data": [
        {
            "id": 189,
            "username": "test",
            "diaryId": 305,
            "comment": "commenttest",
            "createdAt": "2023-07-02T22:26:07.000Z",
            "updatedAt": "2023-07-02T22:26:07.000Z"
        }
    ],
    "message": "test 회원이 작성한 여행기의 댓글을 조회했습니다."
}
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getAllCommentsByUsernameAndDiaryId(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * [관리자] 특정 회원이 작성한 모든 댓글 조회하기
 *
 * @param {CustomRequest} req.params.username 사용자 ID
 * @param {Response} res 댓글 정보를 JSON 형식으로 응답
 * @example
{
    "data": [
        {
            "id": 1,
            "diaryId": 4,
            "comment": "23123",
            "createdAt": "2023-06-04T17:14:06.000Z",
            "updatedAt": "2023-06-10T03:36:51.000Z"
        }
    ]
    "message": "test 회원이 작성한 모든 댓글을 조회했습니다."
}
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function getAllCommentsByUsername(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * [관리자] 특정 회원이 작성한 댓글 삭제하기
 *
 * @param {CustomRequest} req.params.commentId 댓글 ID
 * @param {Response} res 삭제한 commentId를 JSON 형식으로 응답
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function deleteComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

//destination 관련
/**
 * [관리자] 관광지 추가
 *
 * @param {CustomRequest} req.body.nameEn 영문 관광지 이름
 * @param {CustomRequest} req.body.nameKo 한글 관광지 이름
 * @param {CustomRequest} req.body.introduction 관광지 소개
 * @param {CustomRequest} req.body.latitude 관광지 위도
 * @param {CustomRequest} req.body.longitude 관광지 경도
 * @param {Response} res 추가된 관광지 정보를 JSON 형식으로 응답
@example
{
    "nameEn": "dunsan",
    "nameKo": "둔산",
    "introduction": "둔산동",
    "latitude": "123",
    "longitude": "456",
    "image": [
        "http://domain/static/compressed/image.png"
    ]
}
 * @throws {AppError} 이미지 첨부하지 않았을 경우
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function addTouristDestination(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * [관리자] 관광지 수정하기
 *
 * @param {CustomRequest} req.params.id 관광지 ID
 * @param {CustomRequest} req.body.nameEn 영문 관광지 이름
 * @param {CustomRequest} req.body.nameKo 한글 관광지 이름
 * @param {CustomRequest} req.body.introduction 관광지 소개
 * @param {CustomRequest} req.body.latitude 관광지 위도
 * @param {CustomRequest} req.body.longitude 관광지 경도
 * @param {Response} res 수정된 관광지 정보를 JSON 형식으로 응답(관광지 추가 참고)
 * @throws {AppError} 관광지 id가 없는 경우
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function updateTouristDestination(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

/**
 * [관리자] 관광지 삭제하기
 *
 * @param {CustomRequest} req.params.id 관광지 ID
 * @param {Response} res 삭제된 관광지 정보를 JSON 형식으로 응답(관광지 추가 참고)
 * @param {NextFunction} next 다음 미들웨어 함수(에러 핸들러)
 */
export declare function deleteTouristDestination(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;

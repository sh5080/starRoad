import { AppError, CommonError } from '../types/AppError';

import { NextFunction, Request, Response } from 'express';
import * as travelService from '../services/travelService';
import { CustomRequest } from '../types/customRequest';

export const createTravelPlanController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '인증이 필요합니다.', 401);
    }

    const { dates, start_date, end_date, destination, ...extraFields } = req.body;
    console.log(req.body);

    const { username } = req.user;

    console.log('username=', username);
    console.log('extraFields =', extraFields);
    if (!start_date || !end_date || !destination || !dates) {
      throw new AppError(CommonError.INVALID_INPUT, '필수 입력값이 없습니다.', 400);
    }

    if (Object.keys(extraFields).length > 0) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 입력입니다.', 400);
    }

    const startDate: Date | string | undefined = start_date ? new Date(start_date) : undefined;
    const endDate: Date | string | undefined = end_date ? new Date(end_date) : undefined;

    if ((startDate && startDate.toString() === 'Invalid Date') || (endDate && endDate.toString() === 'Invalid Date')) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜입니다.', 400);
    }
    if (startDate && endDate && startDate > endDate) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜 범위입니다.', 400);
    }

    const travelPlanWithUserId = {
      start_date,
      end_date,
      destination,
      username,
    };

    // 여행 일정 등록
    const plan_id = Number(await travelService.createPlan(travelPlanWithUserId));

    // 각 날짜별 장소 등록
    if (dates) {
      for (const dateInfo of dates) {
        console.log('dateInfo = ', dateInfo);
        if (!dateInfo.date) {
          throw new AppError(CommonError.INVALID_INPUT, '날짜가 없는 장소입니다.', 400);
        }
        const locationDate = new Date(dateInfo.date);
        if (startDate && endDate && (locationDate < startDate || locationDate > endDate)) {
          throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜입니다.', 400);
        }
        // 각 날짜에 대해 location을 등록
        if (dateInfo.locations) {
          for (const location of dateInfo.locations) {
            console.log('location = ', location);
            const date = dateInfo.date;
            location.date = date;
            await travelService.createLocation(location, plan_id);
          }
        }
      }
    }
    const responseData = {
      start_date,
      end_date,
      destination,
      username,
      dates,
    };

    console.log('응답데이터 = ', responseData);

    res.status(201).json(responseData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 여행 일정 조회
export const getTravelPlanController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '인증이 필요합니다.', 401);
    }
    const { username } = req.user;

    // 내 여행 일정 조회 해서 여행 일정 데이터에 있는 plan_id 를 통해서 장소 데이터 조회

    const travelPlanData = await travelService.getPlans(username); // 여행 일정 데이터
    if (!travelPlanData) {
      // return res.status(404).json({ error: '여행 일정을 찾을 수 없습니다.' });
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 일정을 찾을 수 없습니다.', 404);
    }

    for (const plan of travelPlanData) {
      // plan_id가 정의되어 있으면 해당 장소 정보를 조회합니다.
      if (plan.plan_id !== undefined) {
        plan.locations = await travelService.getLocations(plan.plan_id);
      }
    }

    res.status(200).json({ travelPlanData });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 여행 일정 상세 조회
export const getTravelPlanDetailController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '인증이 필요합니다.', 401);
    }
    const { plan_id } = req.params;

    // 내 여행 일정 조회 해서 여행 일정 데이터에 있는 plan_id 를 통해서 장소 데이터 조회

    const travelPlanData = await travelService.getPlan(String(plan_id)); // 여행 일정 데이터
    if (!travelPlanData) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 일정을 찾을 수 없습니다.', 404);
    }

    // plan_id가 정의되어 있으면 해당 장소 정보를 조회합니다.
    if (travelPlanData.plan_id !== undefined) {
      travelPlanData.locations = await travelService.getLocations(travelPlanData.plan_id);
    }

    res.status(200).json({ travelPlanData });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 여행 일정 및 날짜별 장소 수정
export const updateTravelPlanAndLocationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const { plan_id } = req.params;
    const { dates, start_date, end_date, destination, ...extraFields } = req.body;
    const { username } = req.user;

    if (Object.keys(extraFields).length > 0) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 입력입니다.', 400);
    }

    const startDate: Date | string | undefined = start_date ? new Date(start_date) : undefined;
    const endDate: Date | string | undefined = end_date ? new Date(end_date) : undefined;
    if ((startDate && startDate.toString() === 'Invalid Date') || (endDate && endDate.toString() === 'Invalid Date')) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜입니다.', 400);
    }
    if (startDate && endDate && startDate > endDate) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜 범위입니다.', 400);
    }

    // 여행 일정 수정
    await travelService.updatePlan(username, {
      plan_id: Number(plan_id),
      username,
      start_date,
      end_date,
      destination,
    });

    // 각 날짜별 장소 수정
    if (dates) {
      for (const dateInfo of dates) {
        if (!dateInfo.date) {
          throw new AppError(CommonError.INVALID_INPUT, '날짜가 없는 장소입니다.', 400);
        }

        // 각 날짜에 대해 location을 수정
        if (dateInfo.locations) {
          for (const location of dateInfo.locations) {
            await travelService.updateLocation(
              {
                plan_id: Number(plan_id),
                location_id: location.location_id, // assuming location_id is a property of the location object
                newDate: dateInfo.date,
                location: location.location,
                order: location.order,
              },
              username
            );
          }
        }
      }
    }

    res.status(200).json(req.body);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 여행 일정 삭제
export const deleteTravelPlanController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // 로그인 확인
    if (!req.user) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }
    const { username } = req.user;
    const { plan_id } = req.params;

    const deletedPlan = await travelService.deletePlan(username, Number(plan_id));

    if (!deletedPlan.deletedPlan[0] || !deletedPlan.deletedLocations[0]) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '없는 일정입니다.', 400);
    }

    res.status(200).json(deletedPlan);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// // 특정 일정의 특정 날짜 장소 삭제
// export const deleteTravelLocationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
//   try {
//     // 로그인 확인
//     if (!req.user) {
//       return res.status(401).json({ error: '인증이 필요합니다.' });
//     }
//     const { username } = req.user;
//     const { plan_id, location_id } = req.params;
//     const planByUsername = await travelService.getPlans(username);
//     const plan = planByUsername.find((plan) => plan.plan_id === Number(plan_id));

//     if (!plan) {
//       throw new AppError(CommonError.RESOURCE_NOT_FOUND, '나의 일정만 삭제할 수 있습니다.', 400);
//     }
//     const travelLocation = {
//       plan_id: Number(plan_id),
//       location_id: Number(location_id),
//     };

//     // 특정 날짜의 장소 삭제
//     const deletedLocations = await travelService.deleteLocation(Number(location_id), travelLocation);
//     if (!deletedLocations.deletedLocations || deletedLocations.deletedLocations.length === 0) {
//       throw new AppError(CommonError.RESOURCE_NOT_FOUND, '일치하는 장소가 없습니다.', 400);
//     }

//     const deletedPlanId = deletedLocations.deletedLocations[0].plan_id;
//     const deletedLocation = deletedLocations.deletedLocations[0].location;

//     if (deletedLocation === null || !deletedLocations.deletedLocations[0]) {
//       throw new AppError(CommonError.RESOURCE_NOT_FOUND, '없는 장소입니다.', 400);
//     }

//     if (Number(plan_id) !== deletedPlanId) {
//       throw new AppError(CommonError.INVALID_INPUT, '일정에 해당 장소가 존재하지 않습니다.', 400);
//     }

//     res.status(200).json(deletedLocations);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

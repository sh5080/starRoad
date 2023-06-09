import { AppError, CommonError } from '../types/AppError';

import { NextFunction, Request, Response } from 'express';
import * as travelService from '../services/travelService';
import { CustomRequest } from '../types/customRequest';

// 여행 일정 등록 + 날짜별 장소 등록
export const createTravelPlanController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError(CommonError.AUTHENTICATION_ERROR, '인증이 필요합니다.', 401);
    }

    const { locations, start_date, end_date, destination, ...extraFields } = req.body;
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

    const travelPlanWithUserId = {
      start_date,
      end_date,
      destination,
      username,
    };

    console.log('여행 일정 등록', travelPlanWithUserId);
    console.log('날짜별 장소 등록', locations);

    // 여행 일정 등록
    const plan_id = Number(await travelService.createPlan(travelPlanWithUserId));

    // 각 날짜별 장소 등록
    if (locations) {
      for (const location of locations) {
        console.log('location = ', location);
        if (!location.date) {
          throw new AppError(CommonError.INVALID_INPUT, '날짜가 없는 장소입니다.', 400);
        }
        const locationDate = new Date(location.date);
        if (startDate && endDate && (locationDate < startDate || locationDate > endDate)) {
          throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜입니다.', 400);
        }
        await travelService.createLocation(location, plan_id);
      }
    }
    const responseData = {
      start_date,
      end_date,
      destination,
      username,
      locations,
    };

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

// 여행 일정 수정
export const updateTravelPlanController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  // 로그인 확인
  console.log();
  try {
    if (!req.user) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }
    const { plan_id } = req.params;
    console.log('plan_id = ', plan_id);
    const { start_date, end_date, destination, ...extraFields } = req.body;
    console.log('req.body = ', req.body);
    const { username } = req.user;
    console.log('username = ', username);

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
    console.log('여행 일정 수정 =', {
      plan_id,
      username,
      start_date,
      end_date,
      destination,
    });

    // 여행 일정 수정
    await travelService.updatePlan({
      plan_id: Number(plan_id),
      username,
      start_date,
      end_date,
      destination,
    });

    res.status(200).json(req.body);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 특정 날짜 +  특정 장소 수정
export const updateTravelLocationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // 로그인 확인
    if (!req.user) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }
    const { plan_id, location_id } = req.params;
    const { location, newDate, order, ...extraFields } = req.body;

    if (Object.keys(extraFields).length > 0) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 입력입니다.', 400);
    }
    // 각 날짜별 장소 수정
    await travelService.updateLocation({
      plan_id: Number(plan_id),
      location_id: Number(location_id),
      newDate,
      location,
      order,
    });

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
    console.log('username = ', username);

    const { plan_id } = req.params;
    console.log('plan_id = ', plan_id);

    const deletedPlan = await travelService.deletePlan(username, Number(plan_id));
    // if (Object.keys(extraFields).length > 0) {
    //   return res.status(400).json({ error: '잘못된 요청입니다. 추가 필드는 허용되지 않습니다.' });
    // }
    console.log(deletedPlan);
    
    res.status(200).json(deletedPlan);
    //res.status(200).json({ message: '여행 일정이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 특정 일정의 특정 날짜 장소 삭제
export const deleteTravelLocationController = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // 로그인 확인
    if (!req.user) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const { plan_id, location_id } = req.params;
    console.log(plan_id, location_id);

    const travelLocation = {
      plan_id: Number(plan_id),
      location_id: Number(location_id),
    };
    // 특정 날짜의 장소 삭제
    await travelService.deleteLocation(travelLocation);
    res.status(200).json(req.user);
    //res.status(200).json({ message: '해당 날짜의 여행 장소가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

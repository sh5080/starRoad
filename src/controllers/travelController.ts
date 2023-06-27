import { AppError, CommonError } from '../types/AppError';
import { NextFunction, Response } from 'express';
import * as travelService from '../services/travelService';
import { CustomRequest } from '../types/customRequest';
import { TravelDate } from '../types/travel';
import { TravelLocation } from '../types/travel';

/** 여행 일정 작성 */
export const createTravelPlan = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { dates, startDate, endDate, destination } = req.body;
    const { username } = req.user!;

    if (
      (String(startDate) && isNaN(Date.parse(String(startDate)))) ||
      (String(endDate) && isNaN(Date.parse(String(endDate))))
    ) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜입니다.', 400);
    }

    if (String(startDate) && String(endDate) && String(startDate) > String(endDate)) {
      throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜 범위입니다.', 400);
    }

    const travelPlanWithUserId = {
      startDate,
      endDate,
      destination,
      username,
    };

    const planId = Number(await travelService.createTravelPlan(travelPlanWithUserId));

    // 각 날짜별 장소 등록
    if (!dates) {
      throw new AppError(CommonError.INVALID_INPUT, '날짜 정보가 필요합니다.', 400);
    }

    for (const dateInfo of dates) {
      if (!dateInfo.date || isNaN(Date.parse(dateInfo.date))) {
        throw new AppError(CommonError.INVALID_INPUT, '날짜가 없는 장소입니다.', 400);
      }

      const locationDate = new Date(dateInfo.date);
      if (
        String(startDate) &&
        String(endDate) &&
        (locationDate < new Date(String(startDate)) || locationDate > new Date(String(endDate)))
      ) {
        throw new AppError(CommonError.INVALID_INPUT, '유효하지 않은 날짜입니다.', 400);
      }

      // 각 날짜에 대해 location을 등록
      if (!dateInfo.locations || dateInfo.locations.length === 0) {
        throw new AppError(CommonError.INVALID_INPUT, '장소 정보가 필요합니다.', 400);
      }

      for (const location of dateInfo.locations) {
        const date = dateInfo.date;
        location.date = date;
        await travelService.createTravelLocationByPlanId(location, planId);
      }
    }

    const responseData = {
      startDate,
      endDate,
      destination,
      username,
      dates,
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 모든 여행 일정 조회 */
export const getTravelPlansByUsername = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.user!;

    const travelPlanData = await travelService.getTravelPlansByUsername(username);

    
    if (!travelPlanData) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 일정을 찾을 수 없습니다.', 404);
    }

    for (const plan of travelPlanData) {
      if (plan.planId !== undefined) {
        const locations = await travelService.getTravelLocationsByPlanId(plan.planId);
        plan.dates = locations.reduce((dates: TravelDate[], location: TravelLocation) => {
          let date = dates.find((date) => date.date === location.date);
          if (!date) {
            date = { date: location.date, locations: [] };
            dates.push(date);
          }
          date.locations?.push(location);
          return dates;
        }, []);
      }
    }

    res.status(200).json({ travelPlanData });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 유저의 여행 일정 상세 조회 */
export const getTravelPlanDetailsByPlanId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.params;
    const travelPlanData = await travelService.getTravelPlanDetailsByPlanId(String(planId));


    if (!travelPlanData) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '여행 일정을 찾을 수 없습니다.', 404);
    }

    if (travelPlanData.planId !== undefined) {
      const locations = await travelService.getTravelLocationsByPlanId(travelPlanData.planId);

      const datesMap: { [date: string]: TravelLocation[] } = {};

      locations.forEach((location: TravelLocation) => {
        const date = location.date;
        if (datesMap[String(date)]) {
          datesMap[String(date)].push(location);
        } else {
          datesMap[String(date)] = [location];
        }
      });

      travelPlanData.dates = Object.keys(datesMap).map((date: string) => ({
        date,
        locations: datesMap[date],
      }));
    }

    res.status(200).json({ travelPlanData });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 여행 일정의 날짜별 장소 수정 */
export const updateTravelPlanAndLocation = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.params;
    const { dates } = req.body;
    const { username } = req.user!;

    // 각 날짜별 장소 수정
    if (dates) {
      for (const dateInfo of dates) {
        if (!dateInfo.date) {
          throw new AppError(CommonError.INVALID_INPUT, '날짜가 없는 장소입니다.', 400);
        }

        // 각 날짜에 대해 location을 수정
        if (dateInfo.locations) {
          for (let i = 0; i < dateInfo.locations.length; i++) {
            dateInfo.locations[i] = await travelService.updateLocation(
              {
                planId: Number(planId),
                locationId: dateInfo.locations[i].locationId,
                newDate: dateInfo.date,
                location: dateInfo.locations[i].location,
                order: dateInfo.locations[i].order,
                latitude: dateInfo.locations[i].latitude,
                longitude: dateInfo.locations[i].longitude,
              },
              username
            );
          }
        }
      }
    }

    res.status(200).json({ dates });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 여행 일정 삭제 */
export const deleteTravelPlan = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.user!;
    const { planId } = req.params;

    const deletedPlan = await travelService.deletePlan(username, Number(planId));

    if (!deletedPlan.deletedPlan[0] || !deletedPlan.deletedLocations[0]) {
      throw new AppError(CommonError.RESOURCE_NOT_FOUND, '없는 일정입니다.', 400);
    }
    res.status(200).json(deletedPlan);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

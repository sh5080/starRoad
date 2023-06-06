import { db } from '../loaders/dbLoader';
import { TravelPlan, TravelLocation } from '../types/travel';

// DB 여행일정 등록
/**
 * 예시
 *
 */
export const createTravelPlanModel = async (travelPlan: TravelPlan): Promise<number> => {
  const connection = await db.getConnection();
  console.log('여기');
  console.log(travelPlan);
  try {
    const [rows] = await connection.execute(
      'INSERT INTO travel_plan (user_id, start_date, end_date, destination) VALUES (?, ?, ?, ?)',
      [travelPlan.user_id, travelPlan.start_date, travelPlan.end_date, travelPlan.destination]
    );
    console.log('여기');

    const insertId = (rows as any).insertId;
    return insertId;
  } finally {
    connection.release(); // connection release
  }
};

// DB에 날짜별 장소 등록
export const createTravelLocationModel = async (travelLocation: TravelLocation, plan_id: number): Promise<void> => {
  const connection = await db.getConnection();
  console.log('DB에 날짜별 장소 등록중');

  try {
    await connection.execute(
      'INSERT INTO travel_location (plan_id, date, location, `order`, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
      [
        plan_id,
        travelLocation.date,
        travelLocation.location,
        travelLocation.order,
        travelLocation.latitude,
        travelLocation.longitude,
      ]
    );
  } finally {
    connection.release();
  }
};

// DB에서 여행일정 조회
export const getTravelPlansModel = async (user_id: string): Promise<TravelPlan[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM travel_plan WHERE user_id = ?', [user_id]);
    return rows as TravelPlan[];
  } finally {
    connection.release();
  }
};

// 한번에 가져오기
// export const getTravelPlansModel = async (user_id: string): Promise<TravelPlan[]> => {
//   const connection = await db.getConnection();
//   try {
//     // Get all travel plans and locations for the user
//     const [rows] = await connection.query(`
//       SELECT
//         travel_plan.*,
//         travel_location.date AS location_date,
//         travel_location.location AS location_location
//       FROM
//         travel_plan
//       LEFT JOIN
//         travel_location
//       ON
//         travel_plan.plan_id = travel_location.plan_id
//       WHERE
//         travel_plan.user_id = ?
//     `, [user_id]);

//     // Prepare an empty object to hold the travel plans
//     const plans: { [key: number]: TravelPlan } = {};

//     // Process each row from the query
//     for (const row of rows) {
//       // If this plan isn't already in our plans object, add it
//       if (!plans[row.plan_id]) {
//         plans[row.plan_id] = {
//           plan_id: row.plan_id,
//           user_id: row.user_id,
//           start_date: row.start_date,
//           end_date: row.end_date,
//           destination: row.destination,
//           created_at: row.created_at,
//           updated_at: row.updated_at,
//           locations: [],
//         };
//       }

//       // If this row has location data, add it to the plan's locations array
//       if (row.location_date && row.location_location) {
//         plans[row.plan_id].locations.push({
//           date: row.location_date,
//           location: row.location_location,
//         });
//       }
//     }

//     // Convert the plans object into an array and return it
//     return Object.values(plans);
//   } finally {
//     connection.release();
//   }
// };

// DB에서 여행일정에 해당하는 날짜별 장소 조회
export const getTravelLocationsModel = async (plan_id: number): Promise<TravelLocation[]> => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM travel_location WHERE plan_id = ?', [plan_id]);
    return rows as TravelLocation[];
  } finally {
    connection.release();
  }
};

// DB에 여행 일정 수정
export const updateTravelPlanModel = async (travelPlan: TravelPlan): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      'UPDATE travel_plan SET start_date = ?, end_date = ?, destination = ? WHERE plan_id = ? AND user_id = ?',
      [travelPlan.start_date, travelPlan.end_date, travelPlan.destination, travelPlan.plan_id, travelPlan.user_id]
    );
  } finally {
    connection.release();
  }
};

// 날짜별 장소 수정
export const updateTravelLocationModel = async (travelLocation: TravelLocation): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      'UPDATE travel_location SET location = ?, date = ?, `order` = ? WHERE plan_id = ? AND location_id = ?',
      [
        travelLocation.location,
        travelLocation.newDate,
        travelLocation.order,
        travelLocation.plan_id,
        travelLocation.location_id,
      ]
    );
  } finally {
    connection.release();
  }
};

// 여행 일정 삭제
export const deleteTravelPlanModel = async (user_id: string, plan_id: number): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('DELETE FROM travel_location WHERE plan_id = ?', [plan_id]);
    await connection.execute('DELETE FROM travel_plan WHERE user_id = ? AND plan_id = ?', [user_id, plan_id]);
  } finally {
    connection.release();
  }
};

// 특정일정 특정날짜별 장소 삭제 (사실상 장소를 null로 설정)
export const deleteTravelLocationModel = async (travelLocation: TravelLocation): Promise<void> => {
  const connection = await db.getConnection();
  try {
    await connection.execute('UPDATE travel_location SET location = NULL WHERE plan_id = ? AND location_id = ?', [
      travelLocation.plan_id,
      travelLocation.location_id,
    ]);
  } finally {
    connection.release();
  }
};

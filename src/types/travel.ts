export interface TravelPlan {
  plan_id?: number;
  username?: string;
  start_date?: Date;
  end_date?: Date;
  destination?: string;
  locations?: TravelLocation[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelLocation {
  //username?: string;
  plan_id?: number;
  date?: string;
  newDate?: string;
  locations?: [];
  location_id?: number;
  location?: string;
  order?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

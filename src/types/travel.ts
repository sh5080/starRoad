export interface TravelPlan {
  plan_id?: number;
  username?: string;
  start_date?: Date;
  end_date?: Date;
  destination?: string;
  locations?: TravelLocation[];
  createdAt?: Date;
  updatedAt?: Date;
  dates?: TravelDate[];
}

export interface TravelDate {
  date?: string;
  locations?: TravelLocation[];
}

export interface TravelLocation {
  location_id?: number;
  plan_id?: number;
  newDate?: string;
  date?: string;
  location?: string;
  order?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelPlan {
  planId?: number;
  username?: string;
  startDate?: Date;
  endDate?: Date;
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
  locationId?: number;
  planId?: number;
  newDate?: string;
  date?: string;
  location?: string;
  order?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

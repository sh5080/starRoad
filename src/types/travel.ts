export interface TravelPlan {
  plan_id?: number;
  user_id: string;
  start_date: Date;
  end_date: Date;
  destination: string;
  locations: TravelLocation[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelLocation {
  user_id: string;
  plan_id: number;
  date: string;
  location: string;
}

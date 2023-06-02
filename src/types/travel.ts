export interface TravelPlan {
  planId?: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  destination: string;
  locations: TravelLocation[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelLocation {
  planId: number;
  date: string;
  location: string;
}

export interface TravelPlan {
  planId?: number;
  userId: string;
  startDate: Date;
  endDate: Date;
  destination: string;
  locations: TravelLocation[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelLocation {
  userId: string;
  planId: number;
  date: string;
  location: string;
}

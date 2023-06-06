import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { TravelLocation } from '../types/travel';
export interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string; role: string };
  params: {
    user_id?: string;
    id?: string;
    diary_id?: string; // Add this if diary_id comes from params
    plan_id?: string;
    date?: string;
    location_id?: string;
  };
  body: {
    user_id: string;
    diary_id?: number; // Add this if diary_id comes from body
    comment?: string;
    title?: string;
    content?: string;
    date?: string;
    location?: string;
    newDate?: string;
    order?: number;
    lat?: number;
    lng?: number;
    start_date?: Date;
    end_date?: Date;
    destination?: string;
    locations?: TravelLocation[];
    createdAt?: Date;
    updatedAt?: Date;
  };
}

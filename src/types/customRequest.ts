import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { TravelLocation } from '../types/travel';
export interface CustomRequest extends Request {
  user?: JwtPayload & { username: string; role: string };
  params: {
    username?: string;
    id?: string;
    diary_id?: string; // Add this if diary_id comes from params
    plan_id?: string;
    date?: string;
    location_id?: string;
    comment_id?: string;
  };
  body: {
    id?: number;
    username: string;
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
    name_ko?: string;
    name_en?: string;
    image?: string;
    introduction?: string;
    role?: string;
    plan_id?: number;
    location_id?: number;
    comment_id?: number;
    dates?: {
      date?: string;
      locations?: TravelLocation[];
    }[];
  };
  file?: Express.Multer.File;
}

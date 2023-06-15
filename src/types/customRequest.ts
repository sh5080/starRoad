import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { TravelLocation } from '../types/travel';

export interface CustomRequest extends Request {
  user?: JwtPayload & { username: string; role: string };
  params: {
    username?: string;
    id?: string;
    diaryId?: string; // Add this if diaryId comes from params
    planId?: string;
    date?: string;
    locationId?: string;
    commentId?: string;
  };
  body: {
    latitude?: number;
    longitude?: number;
    id?: number;
    username: string;
    diaryId?: number; // Add this if diaryId comes from body
    comment?: string;
    title?: string;
    content?: string;
    date?: string;
    location?: string;
    newDate?: string;
    order?: number;
    lat?: number;
    lng?: number;
    startDate?: Date;
    endDate?: Date;
    destination?: string;
    locations?: TravelLocation[];
    createdAt?: Date;
    updatedAt?: Date;
    nameKo?: string;
    nameEn?: string;
    image?: string;
    introduction?: string;
    role?: string;
    planId?: number;
    locationId?: number;
    commentId?: number;
    dates?: {
      date?: string;
      locations?: TravelLocation[];
    }[];
  };
  file?: Express.Multer.File;
}

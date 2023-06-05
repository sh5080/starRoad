import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string; role: string };
  params: {
    id?: string;
    diary_id?: string; // Add this if diary_id comes from params
    plan_id?: string;
    comment_id?: string;
  };
  body: {
    user_id?: string;
    diary_id?: number; // Add this if diary_id comes from body
    comment?: string;
  };
}

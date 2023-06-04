import { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string };
}

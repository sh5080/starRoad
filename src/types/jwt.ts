import { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: JwtPayload & { username: string };
}

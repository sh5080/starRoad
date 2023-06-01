// middleware/validateToken.ts

import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../../config/index';

interface CustomRequest extends Request {
  user?: JwtPayload & { userId: string };
}
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

export const validateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (req.method === 'GET' && !accessToken) {
    return next();
  }

  if (!accessToken) {
    return res.status(401).json({ message: '접근 거부. 유효한 토큰을 제공해주세요.' });
  }

  try {
    req.user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload & { userId: string };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) return res.status(401).json({ message: '접근 거부. 유효한 토큰을 제공해주세요.' });

      try {
        const decodedRefreshToken = (await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)) as JwtPayload & {
          userId: string;
        };

        const newAccessToken = jwt.sign({ userId: decodedRefreshToken.userId }, ACCESS_TOKEN_EXPIRES_IN, {
          expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });

        res.json({ accessToken: newAccessToken });
        next();
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('refreshToken');
          return res.status(401).json({ message: '리프레쉬 토큰이 만료되었습니다. 다시 로그인 해주세요.' });
        }
        return res.status(403).json({ message: '토큰이 유효하지 않습니다. 토큰을 확인해주세요.' });
      }
    } else {
      return res.status(403).json({ message: '토큰이 유효하지 않습니다. 토큰을 확인해주세요.' });
    }
  }
};

export default validateToken;

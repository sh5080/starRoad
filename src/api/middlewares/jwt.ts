// middleware/validateToken.ts

import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../../config/index';
import { AppError, CommonError } from '../middlewares/errorHandler';

interface CustomRequest extends Request {
  user?: JwtPayload & { user_id: string; role: string };
}
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

// 유효성 검사 및 재발급 jwt 미들웨어
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
    req.user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload & { user_id: string; role: string };
    next();
    // next(req.user);
  } catch (err: any) {
    // 토큰이 있는데 유효하지 않은 토큰일 경우(만료된 토큰)
    if (err.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) return res.status(401).json({ message: '접근 거부. 유효한 토큰을 제공해주세요.' });

      try {
        const decodedRefreshToken = (await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)) as JwtPayload & {
          user_id: string;
          role: string;
        };

        const newAccessToken = jwt.sign(
          { user_id: decodedRefreshToken.user_id, role: decodedRefreshToken.role },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
          }
        );

        req.user = { user_id: decodedRefreshToken.user_id, role: decodedRefreshToken.role };
        res.status(200).json({ accessToken: newAccessToken });
        next();
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('refreshToken');
          // return res.status(401).json({ message: '리프레쉬 토큰이 만료되었습니다. 다시 로그인 해주세요.' });
          next(new AppError(CommonError.TOKEN_EXPIRED_ERROR,'리프레쉬 토큰이 만료되었습니다. 다시 로그인 해주세요.', 401));
        }
        next(new AppError(CommonError.TOKEN_EXPIRED_ERROR,'토큰이 유효하지 않습니다. 토큰을 확인해주세요.', 401));
      }
    } else {
      next(new AppError(CommonError.TOKEN_EXPIRED_ERROR,'토큰이 유효하지 않습니다. 토큰을 확인해주세요.', 401));
    }
  }
};

import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import config from '../../config/index';
import { AppError, CommonError } from '../../types/AppError';
import { CustomRequest } from '../../types/customRequest';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN } = config.jwt;

export const validateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  let accessToken;
  let refreshToken;

  if (req.headers?.cookie) {
    const cookies = req.headers.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].startsWith('token=')) {
        const cookieValue = cookies[i].substring(6);
        const decodedValue = decodeURIComponent(cookieValue);
        const jsonStr = decodedValue.substring(2);
        const cookieObject = JSON.parse(jsonStr);
        accessToken = cookieObject.accessToken;
        refreshToken = cookieObject.refreshToken;
        break;
      }
    }
  }

  if (!accessToken) {
    return next(new AppError(CommonError.UNAUTHORIZED_ACCESS, '접근 거부. 유효한 토큰을 제공해주세요.', 401));
  }

  try {
    req.user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload & { username: string; role: string };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        console.error(err);
        return next(
          new AppError(CommonError.TOKEN_EXPIRED_ERROR, '토큰이 유효하지 않습니다. 토큰을 확인해주세요.', 401)
        );
      }

      try {
        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload & {
          username: string;
          role: string;
        };

        const newAccessToken = jwt.sign(
          {
            username: decodedRefreshToken.username,
            role: decodedRefreshToken.role,
          },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
          }
        );

        req.user = {
          username: decodedRefreshToken.username,
          role: decodedRefreshToken.role,
        };

        res
          .cookie('accessToken', newAccessToken, { httpOnly: true, secure: true })
          .status(200)
          .json({ message: '새로운 엑세스 토큰이 발급되었습니다.' });
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          res.clearCookie('refreshToken');
          return next(
            new AppError(CommonError.TOKEN_EXPIRED_ERROR, '리프레쉬 토큰이 만료되었습니다. 다시 로그인 해주세요.', 401)
          );
        }
        return next(
          new AppError(CommonError.TOKEN_EXPIRED_ERROR, '토큰이 유효하지 않습니다. 토큰을 확인해주세요.', 401)
        );
      }
    } else {
      return next(new AppError(CommonError.UNAUTHORIZED_ACCESS, '토큰이 유효하지 않습니다. 토큰을 확인해주세요.', 401));
    }
  }
};

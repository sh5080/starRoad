import dotenv from 'dotenv';
import { Config } from '../types/config';
dotenv.config();

const config: Config = {
  jwt: {
    ACCESS_TOKEN_SECRET:
      process.env.ACCESS_TOKEN_SECRET ||
      (() => {
        throw new Error('ACCESS_TOKEN_SECRET 환경 변수가 필요합니다.');
      })(),
    REFRESH_TOKEN_SECRET:
      process.env.REFRESH_TOKEN_SECRET ||
      (() => {
        throw new Error('REFRESH_TOKEN_SECRET 환경 변수가 필요합니다.');
      })(),
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '12h',
  },
  port:
    process.env.PORT ||
    (() => {
      throw new Error('PORT 환경 변수가 필요합니다.');
    })(),
  database: {
    DB_HOST:
      process.env.DB_HOST ||
      (() => {
        throw new Error('DB_HOST 환경 변수가 필요합니다.');
      })(),
    DB_USER:
      process.env.DB_USER ||
      (() => {
        throw new Error('DB_USER 환경 변수가 필요합니다.');
      })(),
    DB_PASSWORD:
      process.env.DB_PASSWORD ||
      (() => {
        throw new Error('DB_PASSWORD 환경 변수가 필요합니다.');
      })(),
    DB_NAME:
      process.env.DB_NAME ||
      (() => {
        throw new Error('DB_NAME 환경 변수가 필요합니다.');
      })(),
  },
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS ? Number(process.env.BCRYPT_SALT_ROUNDS) : 10,
  },
  google: {
    GOOGLE_CLIENT_ID:
      process.env.GOOGLE_CLIENT_ID ||
      (() => {
        throw new Error('CLIENT_ID 환경 변수가 필요합니다.');
      })(),
    GOOGLE_CLIENT_SECRET:
      process.env.GOOGLE_CLIENT_SECRET ||
      (() => {
        throw new Error('CLIENT_SECRET 환경 변수가 필요합니다.');
      })(),
    GOOGLE_REDIRECT_URI:
      process.env.GOOGLE_REDIRECT_URI ||
      (() => {
        throw new Error('REDIRECT_URI 환경 변수가 필요합니다.');
      })(),
  },
  kakao: {
    KAKAO_CLIENT_ID:
      process.env.KAKAO_CLIENT_ID ||
      (() => {
        throw new Error('CLIENT_ID 환경 변수가 필요합니다.');
      })(),
    KAKAO_REDIRECT_URI:
      process.env.KAKAO_REDIRECT_URI ||
      (() => {
        throw new Error('REDIRECT_URI 환경 변수가 필요합니다.');
      })(),
  },
};

export default config;

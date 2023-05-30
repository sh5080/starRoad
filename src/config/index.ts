import dotenv from 'dotenv';
dotenv.config();
import { Config } from '../types/config';

const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || '',
  

  },
  port: process.env.PORT,
  database: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
  bcrypt: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS ? Number(process.env.BCRYPT_SALT_ROUNDS) : 10,
  },
};

export default config;

export interface Config {
  jwt: {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
  };
  port: string;
  database: {
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  google: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
  };
  kakao: {
    KAKAO_CLIENT_ID: string;
    KAKAO_REDIRECT_URI: string;
  };
}

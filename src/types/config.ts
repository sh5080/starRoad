export interface Config {
  jwt: {
    // 추후 유효성검사 미들웨어 만들예정
  };
  port: string | undefined;
  database: {
    DB_HOST: string | undefined;
    DB_USER: string | undefined;
    DB_PASSWORD: string | undefined;
    DB_NAME: string | undefined;
  };
  bcrypt: {
    saltRounds: number;
  };
}

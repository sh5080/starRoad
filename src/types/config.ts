export interface Config {
  jwt: {
    secret: string;
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

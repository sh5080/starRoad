export interface Config {
  jwt: {
    secret: string;
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
}

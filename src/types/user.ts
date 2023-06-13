export interface UserType {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  role?: string;
  accessToken?: string;
  activated?: number;
}
export interface OauthUser extends UserType {
  username: string;
  email: string;
  activated?: number;
  oauthProvider: 'kakao' | 'google';

}

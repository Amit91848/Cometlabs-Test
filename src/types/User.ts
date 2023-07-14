export interface ISignupUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export enum UserRole {
  User = 0,
  Admin = 1,
}

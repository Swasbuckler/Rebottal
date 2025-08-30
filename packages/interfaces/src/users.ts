export interface User {
  id: number,
  uuid: string,
  createdAt: Date,
  username: string,
  email: string,
  password: string,
  isAdmin: boolean,
};

export interface CreateUser {
  username: string,
  email: string,
  password: string,
};

export interface LogInUser {
  usernameOrEmail: string,
  password: string,
}

export interface CheckValue {
  value: any;
}
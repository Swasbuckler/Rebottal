export interface User {
  id: string,
  createdAt: Date,
  username: string,
  email: string,
  password: string,
  isVerified: boolean,
  isAdmin: boolean,
};

export interface CreateUser {
  username: string,
  email: string,
  password: string,
};

export interface CheckString {
  stringValue: string
}
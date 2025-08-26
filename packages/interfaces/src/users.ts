export interface User {
  id: string,
  createdAt: string,
  username: string,
  email: string,
  password: string,
  isVerified: string,
  isAdmin: string,
};

export interface CreateUser {
  username: string,
  email: string,
  password: string,
};
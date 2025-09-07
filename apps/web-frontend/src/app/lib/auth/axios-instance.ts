'use server';

import axios from "axios";
import { cookies } from "next/headers";
import { parseCookie } from "../utils/cookie-parser";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (request) => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get('AccessToken');

  if (accessTokenCookie) {
    const cookieString = `${accessTokenCookie.name}=${accessTokenCookie.value};`;
    request.headers.set('cookie', cookieString);
  }

  return request;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const cookieStore = await cookies();
      const refreshTokenCookie = cookieStore.get('RefreshToken');

      if (!refreshTokenCookie) {
        return Promise.reject(error);
      }

      const cookieString = `${refreshTokenCookie.name}=${refreshTokenCookie.value};`;

      const response = await axios.post(
        process.env.BACKEND_URL! + '/auth/refresh', 
        {},
        {
          headers: {
            cookie: cookieString
          }
        }  
      );

      response.headers["set-cookie"]!.forEach((cookieString: string) => {
        const parsedCookie = parseCookie(cookieString);
            
        cookieStore.set({
          name: parsedCookie.name,
          value: parsedCookie.value,
          httpOnly: parsedCookie.httpOnly,
          secure: parsedCookie.secure,
          expires: parsedCookie.expires
        });
      });

      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

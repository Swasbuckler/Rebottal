'use client';

import LogInForm from "../ui/auth/log-in";
import axiosInstance from "../lib/auth/axios-instance";

export default function LogIn() {

  const logout = async () => {
    const response = await axiosInstance.get(
      '/api/auth/log-out'
    );
  }

  return (
    <div>
      <LogInForm />
      <button type="button" onClick={() => logout()}>Log Out</button>
    </div>
  );
}

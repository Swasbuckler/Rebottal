'use client';

import axios from "axios";
import LogInForm from "../ui/auth/log-in";

export default function LogIn() {

  const logout = async () => {
    const response = await axios.post(
      '/api/auth/log-out', 
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response)
  }

  return (
    <div>
      <LogInForm />
      <button type="button" onClick={() => logout()}>Log Out</button>
    </div>
  );
}

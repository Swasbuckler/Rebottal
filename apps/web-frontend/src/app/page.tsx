'use client';

import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  
  return (
    <div className="flex flex-col gap-5">
      <Link href={'/sign-up'}>Sign Up</Link>
      <Link href={'/log-in'}>Log In</Link>
      <Link href={'/verification'}>Verification</Link>
      <button type="button" onClick={async () => {
        /*const response = await axios.get(
          'http://localhost:5000/auth/google/oauth'
        );
        redirect(response.data);*/
        redirect('http://localhost:5000/auth/google/callback');
        //window.open('http://localhost:5000/auth/google/oauth', '_blank', "width=800,height=600,left=100,top=100,resizable=yes,scrollbars=yes");
      }}>Sign Up with Google</button>
    </div>
  );
}

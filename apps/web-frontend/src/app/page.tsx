'use client';

import { GoogleSignInParty } from "@rebottal/app-definitions";
import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  return (
    <div className="flex flex-col gap-5">
      <Link href={'/sign-up'}>Sign Up</Link>
      <Link href={'/log-in'}>Log In</Link>
      <Link href={'/verification'}>Verification</Link>
      <Link href={'/test3'}>Test</Link>
      <button type="button" onClick={async () => {
        window.open('/sign-in/google', 'popup', 'popup=true');
        const channel = new BroadcastChannel(GoogleSignInParty);
        channel.addEventListener('message', (event) => {
          if (event.origin === "http://localhost:3000") {
            if (event.data === 'Authenticated') {
              channel.close();
            }
          } else {
            console.warn("Untrusted message origin:", event.origin);
          }
        });
      }}>Sign Up with Google</button>
    </div>
  );
}

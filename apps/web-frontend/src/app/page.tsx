'use client';

import { GoogleSignInParty } from "@rebottal/app-definitions";
import Link from "next/link";
import { boardcastSignInAuthReceive } from './lib/auth/third-party-sign-in';

export default function Home() {

  return (
    <div className="flex flex-col gap-5">
      <Link href={'/sign-up'}>Sign Up</Link>
      <Link href={'/log-in'}>Log In</Link>
      <Link href={'/verification'}>Verification</Link>
      <button type="button" onClick={async () => {
        window.open('/sign-in/google', 'popup', 'popup=true');
        boardcastSignInAuthReceive(GoogleSignInParty);
      }}>
        Sign Up with Google
      </button>
    </div>
  );
}

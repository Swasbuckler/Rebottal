'use client';

import Link from "next/link";
import SignUpForm from "../ui/auth/SignUpForm";
import { DefaultLogo } from "../ui/components/DefaultLogo";
import MaxWidthContainer from "../ui/components/MaxContainer";
import NavBar from "../ui/components/NavBar";
import SignInThirdPartyButton from "../ui/auth/SignInThirdPartyButton";
import { GoogleSignInParty } from "@rebottal/app-definitions";
import { useState } from "react";
import SignUpVerification from "../ui/sign-up/SignUpVerification";
import SignUpInput from "../ui/sign-up/SignUpInput";

export default function SignUp() {

  return (
    <div className="overflow-x-hidden">
      <header className="fixed top-0 w-full z-99">
        <NavBar provideUser={false} />
      </header>
      <SignUpPage />
    </div>
  );
}

function SignUpPage() {

  const [email, setEmail] = useState('shahandyhadian@gmail.com');

  return (
    <>
      <SignUpInput 
        className={email !== '' ? 'hidden' : ''}
        setEmail={setEmail}
      />
      <SignUpVerification 
        className={email === '' ? 'hidden' : ''}
        email={email}
        completionEndPoint="/log-in"
      />
    </>
  )
}

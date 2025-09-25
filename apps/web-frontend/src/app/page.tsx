'use client';

import { GoogleSignInParty } from "@rebottal/app-definitions";
import Link from "next/link";
import { boardcastSignInAuthReceive } from './lib/auth/third-party-sign-in';
import NavBar from "./ui/components/NavBar";
import Hero from "./ui/components/Hero";
import Service from "./ui/components/Service";
import gsap, { DrawSVGPlugin, ScrollSmoother, ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import HowToPlay from "./ui/components/HowToPlay";

gsap.registerPlugin(useGSAP, DrawSVGPlugin, SplitText, ScrollTrigger, ScrollSmoother);

export default function HomePage() {

  useGSAP(() => {

    ScrollSmoother.create({
      wrapper: '#wrapper',
      content: '#content',
      smooth: 1,
      effects: true,
      ignoreMobileResize: true,
    });

  });

  return (
    <div id="wrapper">
      <header className="fixed top-0 w-full z-99">
        <NavBar />
      </header>
      <div id="content">
        <Hero />
        <Service />
        <HowToPlay />
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
      </div>
    </div>
  );
}

'use client';

import NavBar, { NavBarContentSmooth } from "./ui/components/NavBar";
import Hero from "./ui/home/Hero";
import Service from "./ui/home/Service";
import gsap, { DrawSVGPlugin, ScrollSmoother, ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import HowToPlay from "./ui/home/HowToPlay";
import { useRef } from "react";
import ScrollToTop from "./ui/components/ScrollToTop";

gsap.registerPlugin(useGSAP, DrawSVGPlugin, SplitText, ScrollTrigger, ScrollSmoother);

export default function HomePage() {

  const smoother = useRef<ScrollSmoother | null>(null);

  const navBarContent: NavBarContentSmooth[] = [
    {
      text: 'Home',
      linkContent: {
        linkType: 'scroll',
        callback: () => {
          smoother.current?.scrollTo('#home', true);
        }
      },
    },
    {
      text: 'How To Play',
      linkContent: {
        linkType: 'scroll',
        callback: () => {
          smoother.current?.scrollTo('#howtoplay', true);
        }
      },
    },
  ];

  useGSAP(() => {

    smoother.current = ScrollSmoother.create({
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
        <NavBar navBarContent={navBarContent} />
      </header>
      <ScrollToTop smoother={smoother} />
      <div id="content">
        <Hero 
          id="home" 
          smoother={smoother}
        />
        <Service />
        <HowToPlay id="howtoplay" />
      </div>
    </div>
  );
}

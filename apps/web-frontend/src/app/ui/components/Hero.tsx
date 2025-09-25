'use client';

import { useTheme } from "@/app/lib/utils/ThemeProvider";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "gsap/all";
import { useEffect, useRef } from "react";
import { DefaultLogo } from "./DefaultLogo";

export default function Hero() {

  const {theme} = useTheme();
  const sillyAnimation = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {

    const heroTextSplit = SplitText.create('.hero-text', {
      type: 'chars',
    });
    
    const heroTextSilly = SplitText.create('.hero-text-silly', {
      type: 'chars',
    });

    heroTextSilly.chars.forEach((char) => {
      char.classList.add('hero-text-silly-char');
    })

    const heroTextSub = SplitText.create('.hero-text-sub', {
      type: 'words',
    });

    const heroTextAnd = heroTextSplit.chars.slice(7, 10); // Chars for the word "and"
    const heroTextRebuttals = heroTextSplit.chars.slice(10); // Chars for the word "Rebuttals"

    gsap.timeline()
      .to('.hero-text-debates', {
        duration: 0.5,
        delay: 1,
        drawSVG: '0%',
      })
      .from(heroTextAnd, {
        duration: 0.2,
        opacity: 0,
        borderRight: '5px solid white',
        stagger: 0.1,
      })
      .from(heroTextRebuttals, {
        rotateZ: -90,
        transformOrigin: '100px 0px',
        stagger: 0.1,
        ease: 'back.inOut'
      })
      .from('.hero-text-silly1', {
        duration: 0.2,
        opacity: 0,
      })
      .from(heroTextSilly.chars, {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.05,
        ease: 'back.inOut',
        onComplete: () => {
          sillyAnimation.current = gsap.to(heroTextSilly.chars, {
            duration: 1,
            color: '#00b8db',
            stagger: {
              each: 0.1,
              yoyo: true,
              repeat: -1,
            },
            ease: 'power3.inOut',
          });
        }
      })
      .from('.hero-text-silly2', {
        duration: 0.3,
        opacity: 0
      })
      .from(heroTextSub.words, {
        rotateX: 90,
        transformOrigin: '50% 50% 10px',
        opacity: 0,
        stagger: 0.03,
        delay: 0.25,
        ease: 'back.inOut'
      })
      .from('.hero-buttons', {
        duration: 1,
        opacity: 0,
        delay: 0.5
      })

  });

  useEffect(() => {
    if (sillyAnimation.current === null) {
      return;
    }

    gsap.context(() => {      
      sillyAnimation.current!.revert();
      
      sillyAnimation.current = gsap.to('.hero-text-silly-char', {
        duration: 1,
        color: '#53eafd',
        stagger: {
          each: 0.1,
          yoyo: true,
          repeat: -1,
        },
        ease: 'power3.inOut',
      });
    });
  }, [theme]);

  return (
    <>
      <div id="hero-container" className="z-1">
        <div className="flex flex-col gap-5 items-center justify-center w-full h-[75vh] md:h-screen">
          <div className="relative text-2xl hero-text text-center overflow-hidden">
            <span className="font-bungee tracking-wide">Debates</span> and <span className="font-bungee tracking-wide">Rebuttals</span>
            <DebatesAnimationSvgs />
          </div>
          <div className="text-5xl font-bold text-center"><span className="hero-text-silly1">With the</span> <span className="hero-text-silly">Silliest</span> <span className="hero-text-silly2">of AI ChatBots</span></div>
          <div className="text-base text-center hero-text-sub">Challenge and play with the personalities of our Bots. Try your luck and put your intellect to the test against their goofiness.</div>
          <HeroButtons />
        </div>
      </div>
      <TransitionWave />
    </>
  );
}

function DebatesAnimationSvgs() {

  const commonClassName = 'h-5 stroke-28 stroke-[#ededed] dark:stroke-[#0a0a0a] transform';

  return (
    <div className="absolute top-0 flex items-center size-full fill-none pointer-events-none">
      <DebatesSvg
        className={`${commonClassName} translate-x-[1px]`}
        viewBox="0 0 62 74" 
      >
        <path 
          className="hero-text-debates"
          d="M24 62H51V9H11V74" 
        />
      </DebatesSvg>
      <DebatesSvg
        className={`${commonClassName} translate-x-[2.5px]`}
        viewBox="0 0 66 75" 
      >
        <path 
          className="hero-text-debates"
          d="M46 36H22M55 10H11V63H55" 
        />
      </DebatesSvg>
      <DebatesSvg
        className={`${commonClassName} translate-x-[1.5px]`}
        viewBox="0 0 61 74" 
      >
        <path 
          className="hero-text-debates"
          d="M22 9H50V36M22 36H50V63H11V0" 
        />
      </DebatesSvg>
      <DebatesSvg
        className={`${commonClassName} translate-x-[2px]`}
        viewBox="0 0 62 73" 
      >
        <path 
          className="hero-text-debates"
          d="M24 49H38M51 72V37L41 10H21L11 37V72" 
        />
      </DebatesSvg>
      <DebatesSvg
        className={`${commonClassName} translate-x-[3px]`}
        viewBox="0 0 60 75" 
      >
        <path 
          className="hero-text-debates"
          d="M30 72V19M60 10H0" 
        />
      </DebatesSvg>
      <DebatesSvg
        className={`${commonClassName} translate-x-[4.5px]`}
        viewBox="0 0 66 75" 
      >
        <path 
          className="hero-text-debates"
          d="M46 36H22M55 10H11V63H55" 
        />
      </DebatesSvg>
      <DebatesSvg
        className={`${commonClassName} translate-x-[2.5px]`}
        viewBox="0 0 60 76" 
      >
        <path 
          className="hero-text-debates"
          d="M52 9H10V33l37 7V63H0" 
        />
      </DebatesSvg>
    </div>
  );
}

function DebatesSvg({
  className,
  viewBox,
  children,
}: {
  className: string | undefined,
  viewBox: string,
  children: React.ReactNode
}) {

  return (
    <svg
      className={className}
      viewBox={viewBox} 
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      {children}
    </svg>
  );
}

function HeroButtons() {

  const getStartedPopAnimation = useRef<gsap.core.Timeline | null>(null);

  const getStartedEnter = () => {
    gsap.context(() => {
      if (getStartedPopAnimation.current === null) {
        getStartedPopAnimation.current = gsap.timeline()
          .to('.get-started-pop', {
            duration: 1,
            rotate: 0,
            opacity: 1,
            ease: 'elastic.inOut'
          }, 0)
          .to('.get-started-pop-mouth', {
            duration: 0.5,
            delay: 0.5,
            scaleY: 0,
            ease: 'power2.inOut'
          }, 0);
        return;
      }

      getStartedPopAnimation.current!.play();
    });
  }

  const getStartedLeave = () => {
    if (getStartedPopAnimation.current === null) {
      return;
    }
    
    gsap.context(() => {
      getStartedPopAnimation.current!.reverse();
    });
  }

  return (
    <div className="flex gap-10 mt-6 hero-buttons">
      <button 
        className="relative p-1 rounded-md transform hover:scale-105 bg-[linear-gradient(to_right,#0092b8_0%,#00b8db_50%,#0092b8_100%,#00b8db_150%,#0092b8_200%)] dark:bg-[linear-gradient(to_right,#53eafd_0%,#00b8db_50%,#53eafd_100%,#00b8db_150%,#53eafd_200%)] bg-size-[200%_100%] bg-repeat bg-position-[50%_0] hover:bg-position-[-650%_0] hover:shadow-lg/75 hover:shadow-cyan-500 transition-all ease-in-out duration-700 cursor-pointer"
        type="button"
        onMouseEnter={() => getStartedEnter()}
        onMouseLeave={() => getStartedLeave()}
      >
        <div className="p-4 px-6 rounded-sm font-bungee bg-[#ededed] dark:bg-[#0a0a0a] z-10">
          Get Started
        </div>
        <div className="absolute -top-7 left-3/4 size-12 transform origin-bottom-left opacity-0 rotate-90 pointer-events-none z-5 get-started-pop">
          <DefaultLogo className="absolute size-12 fill-[#171717] dark:fill-[#ededed] z-5" />
          <div className="absolute top-2.5 left-[1px] w-11.5 h-7.5 transform origin-bottom bg-[#171717] dark:bg-[#ededed] z-5 get-started-pop-mouth"></div>
          <div className="absolute top-2.5 left-[1px] w-11.5 h-7.5 transform origin-bottom bg-[#ededed] dark:bg-[#171717] z-1"></div>
        </div>
      </button>
      <button 
        className="p-4 px-6 hover:scale-105 bg-[#ededed] dark:bg-[#0a0a0a] border-2 border-[#0a0a0a] dark:border-[#ededed] cursor-pointer hover:[&>*>*>span:nth-child(1)]:top-full hover:[&>*>*>span:nth-child(2)]:top-0 hover:shadow-lg/50 hover:shadow-cyan-500 transition-all ease-in-out duration-400"
        type="button"
      >
        <div className="flex gap-3 items-center">
          Learn How to Play 
          <div className="relative size-6 border-2 rounded-full border-[#0a0a0a] dark:border-[#ededed] overflow-hidden hero-arrows">
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/6 transition-all ease-in-out duration-400">↓</span>
            <span className="absolute -top-full left-1/2 transform -translate-x-1/2 -translate-y-1/6 transition-all ease-in-out duration-400">↓</span>
          </div>
        </div>
      </button>
    </div>
  );
}

function TransitionWave() {

  useGSAP(() => {

    gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-container',
        pin: true,
        start: 'top top',
        end: 'top+=100%',
        scrub: 1
      }
    })
      .to('.wave-svg-1', {
        y: '-5vh'
      }, 'wave')
      .to('.wave-svg-2', {
        y: '-3vh'
      }, 'wave');

  });

  return (
    <>
      <div className="absolute top-[75vh] md:top-[100vh] w-full h-20">
        <div className="absolute top-0 size-full z-0 wave-svg-1">
          <svg 
            className="fill-cyan-500"
            width="100%" 
            height="82" 
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <pattern 
              id="bg-1" 
              patternUnits="userSpaceOnUse" 
              width="288" 
              height="82"
            >
              <path 
                d="M0 80 0 15C23.6976 11.2622 47.3952 7.5244 67.6 9.4 87.8048 11.2756 104.5167 18.7646 123 21.2 141.4833 23.6354 161.7378 21.0172 178 18.6 194.2622 16.1828 206.5321 13.9665 224.2 13.4 241.8679 12.8335 264.934 13.9167 288 15L288 80 0 80Z" 
                fillOpacity="0.4"
              ></path>
            </pattern>
            <rect 
              width="100%" 
              height="100%" 
              fill="url(#bg-1)"
            />
          </svg>
          <div className="w-full h-[calc(75vh-5rem)] md:h-[calc(100vh-5rem)] transform -translate-y-[2px] bg-linear-to-b from-cyan-500/40 to-[#ededed] dark:to-[#0a0a0a]"></div>
        </div>
        <div className="absolute top-0 size-full z-0 wave-svg-2">
          <svg 
            className="fill-cyan-500"
            width="100%" 
            height="82" 
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <pattern 
              id="bg-2" 
              patternUnits="userSpaceOnUse" 
              width="288" 
              height="82"
            >
              <path 
                d="M0 80 0 35C15.0584 32.7627 30.1167 30.5254 48.8 31.2 67.4833 31.8746 89.7914 35.4612 112.8 36.6 135.8086 37.7388 159.5177 36.4297 177 37 194.4823 37.5703 205.7378 40.0201 223.2 40 240.6622 39.9799 264.3311 37.49 288 35L288 80 0 80Z" 
                fillOpacity="0.53"
              ></path>
            </pattern>
            <rect 
              width="100%" 
              height="100%" 
              fill="url(#bg-2)"
            />
          </svg>
          <div className="w-full h-[calc(75vh-5rem)] md:h-[calc(100vh-5rem)] transform -translate-y-[2px] bg-linear-to-b from-cyan-500/53 to-[#ededed] dark:to-[#0a0a0a]"></div>
        </div>
        <div className="absolute top-0 size-full z-10 wave-svg-3">
          <svg 
            className="fill-cyan-500"
            width="100%" 
            height="82" 
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <pattern 
              id="bg-3" 
              patternUnits="userSpaceOnUse" 
              width="288" 
              height="82"
            >
              <path 
                d="M0 80 0 55C12.5684 58.5196 25.1368 62.0392 46.8 59.6 68.4632 57.1608 99.2211 48.7627 119 49.8 138.7789 50.8373 147.5789 61.31 163 61.8 178.4211 62.29 200.4632 52.7971 222.4 50 244.3368 47.2029 266.1684 51.1014 288 55L288 80 0 80Z" 
                fillOpacity="1"
              ></path>
            </pattern>
            <rect 
              width="100%" 
              height="100%" 
              fill="url(#bg-3)"
            />
          </svg>
          <div className="w-full h-[calc(75vh-5rem)] md:h-[calc(100vh-5rem)] transform -translate-y-[2.5px] bg-linear-to-b from-cyan-500 to-[#ededed] dark:to-[#0a0a0a]"></div>
        </div>
        <WaveBoat className="absolute top-3 left-2/3 transform -translate-x-1/2 w-full h-15 z-9" />
        <div className="absolute top-3 left-2/3 transform -translate-x-16 w-[1px] h-[calc(75vh+6rem)] md:h-[calc(100vh+6rem)] rounded-full bg-linear-to-b from-[#0a0a0a] to-[#0a0a0a00] dark:from-[#ededed] dark:to-[#ededed00] z-10"></div>
      </div>
    </>
  );
}

function WaveBoat({
  className
}: {
  className?: string
}) {

  return (
    <div className={className}>
      <svg 
        className="size-full bg-teal-8"
        viewBox="0 0 75 35"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <path
          className="fill-[#ededed] dark:fill-[#0a0a0a]"
          d="M19 16 0 0 23 16Z"
        ></path>
        <path
          className="stroke-1 stroke-[#0a0a0a] dark:stroke-[#ededed] fill-[#ededed] dark:fill-[#0a0a0a]"
          d="M19 16a1 1 0 00-4 0 1 1 0 004 0Z"  
        ></path>
        <path
          d="M5 16 15 36H65L75 16Z"  
          fill="#007595"
        ></path>
        <path
          d="M75 16 70 1H35L40 16Z"  
          fill="#009689"
        ></path>
        <path
          d="M40 16 35 1 30 16Z"  
          fill="#005f5a"
        ></path>
      </svg>
    </div>
  );
}
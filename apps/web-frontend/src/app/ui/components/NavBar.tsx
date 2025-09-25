'use client';

import Link from "next/link";
import { DefaultLogo } from "./DefaultLogo";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ThemeSelect from "./ThemeSelect";
import ClickOutside from "@/app/lib/utils/ClickOutside";

export default function NavBar() {
  
  const [navBarOpen, setNavBarOpen] = useState(false);
  const isTabletSize = useMediaQuery({
    query: '(min-width: 1024px)'
  });

  const navBarRef = useRef<HTMLDivElement | null>(null);

  const onClickOutside = () => {
    setNavBarOpen(false);
  };

  useEffect(() => {
    setNavBarOpen(false);
  }, [ isTabletSize ]);

  return (
    <ClickOutside
      clickRef={navBarRef}
      onClickOutside={onClickOutside}
    >
      <div 
        className="ransition-all bg-[#edededBF] dark:bg-[#0a0a0aBF] z-99 2xl:flex 2xl:justify-center"
        ref={navBarRef}  
      >
        <CentralNavBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
        <SideNavBar navBarOpen={navBarOpen} />
      </div>
    </ClickOutside>
  );
}

const navBarList = [
  'Home',
  'How to Play',
  'About Us'
];

function CentralNavBar({
  navBarOpen, 
  setNavBarOpen
}: {
  navBarOpen: boolean,
  setNavBarOpen: Dispatch<SetStateAction<boolean>>
}) {

  return (
    <nav className="flex items-center justify-between p-6 lg:px-8 2xl:w-384">
      <RebottalLogo />
      <SideNavBarButton navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
      <NavBarContent className="hidden lg:flex lg:gap-8" />
      <div className="hidden h-8 lg:flex lg:flex-1 lg:gap-5 lg:items-center lg:justify-end">
        <ThemeSelect />
        <LogInButton />
      </div>
    </nav>
  );
}

function SideNavBar({
  navBarOpen,
}: {
  navBarOpen: boolean,
}) {

  return (
    <div className={`absolute flex flex-col lg:hidden w-full p-6 transform ${navBarOpen ? 'bg-[#edededBF] dark:bg-[#0a0a0aBF] opacity-100' : '-translate-y-full opacity-0'} z-5 transition-all duration-300`}>
      <NavBarContent className="flex flex-col gap-3" />
      <ThemeSelect />
      <LogInButton className="flex-1 justify-end mt-10" />
    </div>
  );
}

function RebottalLogo() {

  return (
    <div className="flex lg:flex-1 gap-2 items-center z-10 font-bungee">
      <DefaultLogo className="size-8 fill-[#171717] dark:fill-[#ededed] transition-all" />
      <p className="text-xl">Re<span>bot</span>tal</p>
    </div>
  );
}

function SideNavBarButton({
  navBarOpen, 
  setNavBarOpen
}: {
  navBarOpen: boolean,
  setNavBarOpen: Dispatch<SetStateAction<boolean>>
}) {

  return (
    <ul 
      className={`flex flex-col gap-1.5 lg:hidden ${navBarOpen ? '[&>li:nth-child(1)]:transform [&>li:nth-child(1)]:translate-y-2.5 [&>li:nth-child(1)]:rotate-45 [&>li:nth-child(2)]:opacity-0 [&>li:nth-child(3)]:transform [&>li:nth-child(3)]:-translate-y-2.5 [&>li:nth-child(3)]:-rotate-45' : ''} w-8 z-10 cursor-pointer hover:*:border-cyan-500`} 
      onClick={() => setNavBarOpen(!navBarOpen)}
    >
      <li className="w-full border-2 border-[#171717] dark:border-[#ededed] bg-[#171717] dark:bg-[#ededed] transition-all"></li>
      <li className="w-full border-2 border-[#171717] dark:border-[#ededed] bg-[#171717] dark:bg-[#ededed] transition-all"></li>
      <li className="w-full border-2 border-[#171717] dark:border-[#ededed] bg-[#171717] dark:bg-[#ededed] transition-all"></li>
    </ul>
  );
}

function NavBarContent({
  className
}: {
  className?: string
}) {
  
  return (
    <ul className={className}>
      {navBarList.map((navBarText, idx) => 
        <li 
          className="text-lg"
          key={idx}
        >
          {navBarText}
        </li>
      )}
    </ul>
  );
}

function LogInButton({
  className
}: {
  className?: string
}) {

  return (
    <div className={className}>
      <Link href={'/log-in'}>Log In / Create an Account →</Link>
    </div>
  );
}
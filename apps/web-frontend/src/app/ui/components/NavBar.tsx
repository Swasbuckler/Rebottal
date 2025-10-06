'use client';

import Link from "next/link";
import { DefaultLogo } from "./DefaultLogo";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ThemeSelect from "./ThemeSelect";
import ClickOutside from "@/app/lib/utils/ClickOutside";
import MaxWidthContainer from "./MaxContainer";

export default function NavBar({
  navBarContent = [],
  provideUser = true
}: {
  navBarContent?: (NavBarContent | NavBarContentSmooth)[],
  provideUser?: boolean
}) {
  
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
        className="transition-all bg-[#edededBF] dark:bg-[#0a0a0aBF] z-99 2xl:flex 2xl:justify-center"
        ref={navBarRef}  
      >
        <CentralNavBar 
          navBarOpen={navBarOpen} 
          setNavBarOpen={setNavBarOpen} 
          navBarContent={navBarContent}
          provideUser={provideUser}
        />
        <SideNavBar 
          navBarOpen={navBarOpen} 
          navBarContent={navBarContent}
          provideUser={provideUser}
        />
      </div>
    </ClickOutside>
  );
}

function CentralNavBar({
  navBarOpen, 
  setNavBarOpen,
  navBarContent,
  provideUser
}: {
  navBarOpen: boolean,
  setNavBarOpen: Dispatch<SetStateAction<boolean>>,
  navBarContent: (NavBarContent | NavBarContentSmooth)[],
  provideUser: boolean
}) {

  return (
    <MaxWidthContainer>
      <nav className="flex items-center justify-between px-6 py-3 md:p-6 lg:px-8">
        <RebottalLogo />
        <SideNavBarButton navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />
        <NavBarContent 
          className="hidden lg:flex lg:gap-8" 
          navBarContent={navBarContent}
        />
        <div className="hidden h-8 lg:flex lg:flex-1 lg:gap-5 lg:items-center lg:justify-end">
          <ThemeSelect />
          {provideUser && <LogInButton />}
        </div>
      </nav>
    </MaxWidthContainer>
  );
}

function SideNavBar({
  navBarOpen,
  navBarContent,
  provideUser
}: {
  navBarOpen: boolean,
  navBarContent: (NavBarContent | NavBarContentSmooth)[],
  provideUser: boolean
}) {

  return (
    <div className={`absolute flex flex-col gap-5 lg:hidden w-full px-6 py-3 md:p-6 transform ${navBarOpen ? 'bg-[#edededBF] dark:bg-[#0a0a0aBF] opacity-100' : '-translate-y-3/2 opacity-0'} z-5 transition-all duration-300`}>
      <NavBarContent 
        className="flex flex-col gap-3" 
        navBarContent={navBarContent}
      />
      <ThemeSelect />
      {provideUser && <LogInButton className="flex-1 justify-end" />}
    </div>
  );
}

function RebottalLogo() {

  return (
    <div className="self-start lg:flex-1 z-10">
      <Link href={'/'} className="flex gap-2 items-center w-fit z-10 font-bungee">
        <DefaultLogo className="size-8 fill-[#171717] dark:fill-[#ededed] transition-all" />
        <p className="text-xl">Re<span>bot</span>tal</p>
      </Link>
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
      className={`flex flex-col gap-1.25 md:gap-1.5 lg:hidden w-6 md:w-8 z-10 hover:*:border-cyan-500 cursor-pointer ${navBarOpen ? 
        '[&>li:nth-child(1)]:transform [&>li:nth-child(1)]:translate-y-[6.25px] md:[&>li:nth-child(1)]:translate-y-2.5 [&>li:nth-child(1)]:rotate-45 [&>li:nth-child(2)]:opacity-0 [&>li:nth-child(3)]:transform [&>li:nth-child(3)]:-translate-y-[6.25px] md:[&>li:nth-child(3)]:-translate-y-2.5 [&>li:nth-child(3)]:-rotate-45' : 
        ''}`} 
      onClick={() => setNavBarOpen(!navBarOpen)}
    >
      <li className="w-full border-1 md:border-2 border-[#171717] dark:border-[#ededed] bg-[#171717] dark:bg-[#ededed] transition-all"></li>
      <li className="w-full border-1 md:border-2 border-[#171717] dark:border-[#ededed] bg-[#171717] dark:bg-[#ededed] transition-all"></li>
      <li className="w-full border-1 md:border-2 border-[#171717] dark:border-[#ededed] bg-[#171717] dark:bg-[#ededed] transition-all"></li>
    </ul>
  );
}

function NavBarContent({
  className,
  navBarContent
}: {
  className?: string,
  navBarContent: (NavBarContent | NavBarContentSmooth)[]
}) {
  
  return (
    <ul className={className}>
      {navBarContent.map((content, idx) => {
        const linkContent = content.linkContent;

        switch (linkContent.linkType) {
          case 'scroll':
            if ('link' in linkContent) {
              return (
                <a 
                  className="cursor-pointer"
                  href={linkContent.link}
                  key={idx}
                >
                  <li className="text-base">
                    {content.text}
                  </li>
                </a>
              );
            } else {
              return (
                <li
                  className="text-base cursor-pointer"
                  key={idx}
                  onClick={() => linkContent.callback()}
                >
                  {content.text}
                </li>
              );
            }

          case 'link':
            return (
              <Link 
                className="cursor-pointer"
                href={linkContent.link}
                key={idx}
              >
                <li className="text-base">
                  {content.text}
                </li>
              </Link>
            );
        }
      })}
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

export type NavBarContent = {
  text: string,
  linkContent: {
    link: string,
    linkType: 'scroll' | 'link'
  }
};
export type NavBarContentSmooth = {
  text: string,
  linkContent: {
    linkType: 'scroll',
    callback: () => void
  } | {
    link: string,
    linkType: 'link'
  },
}
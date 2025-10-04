'use client';

import LogInForm from "../ui/auth/LogInForm";
import LogOut from "../lib/utils/LogOut";
import NavBar, { NavBarContent } from "../ui/components/NavBar";
import MaxWidthContainer from "../ui/components/MaxContainer";
import { DefaultLogo } from "../ui/components/DefaultLogo";
import Link from "next/link";

export default function LogIn() {

  return (
    <div className="overflow-hidden">
      <header className="fixed top-0 w-full z-99">
        <NavBar provideUser={false} />
      </header>
      <LogInPage />
    </div>
  );
}

function LogInPage() {

  return (
    <MaxWidthContainer>
      <div className="flex flex-col justify-center items-center gap-5 md:gap-15 h-screen">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
          <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 p-6">
            <div className="flex flex-col justify-center items-center gap-2">
              <DefaultLogo className="size-15 md:size-30 fill-cyan-500" />
              <h1 className="text-lg text-center font-bold">Log In to <span className="font-bungee">Rebottal</span></h1>
            </div>
          </div>
          <div className="w-[calc(100%-3rem)] md:w-2/3 lg:w-2/5 xl:w-1/3 p-5 mx-6 md:ml-0 md:mr-6 bg-gray-100 dark:bg-gray-950 border-1 border-[#171717] dark:border-[#ededed] rounded-lg">
            <LogInForm />
          </div>
        </div>
        <div className="flex justify-center gap-2 w-[calc(100%-3rem)] md:w-[calc(100%-3rem)] lg:w-[calc(80%-1rem)] xl:w-[calc(66.666667%-1rem)] p-5 mx-6 bg-gray-100 dark:bg-gray-950 border-1 border-[#171717] dark:border-[#ededed] rounded-lg text-sm">
          New to Rebottal? 
          <Link 
            className="text-cyan-600 dark:text-cyan-500 hover:text-cyan-400 underline transition-all ease-in-out duration-200"
            href={'/sign-up'}
          >
            Create an Account
          </Link>
        </div>
      </div>
    </MaxWidthContainer>
  );
}

function LogOutButton() {

  return (
    <LogOut>
      <button type="button">Log Out</button>
    </LogOut>
  );
}
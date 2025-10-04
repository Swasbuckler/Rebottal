'use client';

import Link from "next/link";
import SignUpForm from "../ui/auth/SignUpForm";
import { DefaultLogo } from "../ui/components/DefaultLogo";
import MaxWidthContainer from "../ui/components/MaxContainer";
import NavBar from "../ui/components/NavBar";
import SignInThirdPartyButton from "../ui/auth/SignInThirdPartyButton";
import { GoogleSignInParty } from "@rebottal/app-definitions";

export default function SignUp() {

  return (
    <div className="overflow-hidden">
      <header className="fixed top-0 w-full z-99">
        <NavBar provideUser={false} />
      </header>
      <SignUpPage />
    </div>
  );
}

function SignUpPage() {

  return (
    <MaxWidthContainer>
      <div className="flex flex-col justify-center items-center gap-5 my-14 md:my-20">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
          <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 p-6">
            <div className="flex flex-col justify-center items-center gap-2">
              <DefaultLogo className="size-10 sm:size-15 md:size-30 fill-cyan-500" />
              <h1 className="text-lg text-center font-bold">Sign Up to <span className="font-bungee">Rebottal</span></h1>
            </div>
          </div>
          <div className="flex flex-col gap-5 w-[calc(100%-3rem)] md:w-2/3 lg:w-2/5 xl:w-1/3 p-5 mx-6 md:ml-0 md:mr-6 bg-gray-100 dark:bg-gray-950 border-1 border-[#171717] dark:border-[#ededed] rounded-lg">
            <SignUpForm />
            <div className="relative flex justify-center w-full before:absolute before:top-1/2 before:left-1/10 before:block before:content-[' '] before:w-1/4 before:h-[0.5px] before:bg-[#171717] before:dark:bg-[#ededed] after:absolute after:top-1/2 after:right-1/10 after:block after:content-[' '] after:w-1/4 after:h-[0.5px] after:bg-[#171717] after:dark:bg-[#ededed]">
              <div className="">OR</div>
            </div>
            <SignInThirdPartyButton
              className="flex justify-center items-center gap-2 h-8 p-1 text-sm lg:text-base text-[#171717] dark:text-[#ededed] bg-[#ededed] dark:bg-[#0a0a0a] hover:bg-gray-200 dark:hover:bg-gray-900 border-1 border-gray-500 dark:border-[#ededed] rounded-md cursor-pointer transition-all ease-in-out duration-200"
              thirdPartyEndPoint="/google"
              authParty={GoogleSignInParty}
            >
              <div className="h-4/5">
                <svg 
                  version="1.1" 
                  xmlns="http://www.w3.org/2000/svg" 
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 48 48" 
                  className="size-full"
                >
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              Sign In with Google
            </SignInThirdPartyButton>
          </div>
        </div>
        <div className="flex justify-center gap-2 w-[calc(100%-3rem)] md:w-[calc(100%-3rem)] lg:w-[calc(80%-1rem)] xl:w-[calc(66.666667%-1rem)] p-5 mx-6 bg-gray-100 dark:bg-gray-950 border-1 border-[#171717] dark:border-[#ededed] rounded-lg text-sm lg:text-base">
          Already have an Account?
          <Link 
            className="text-cyan-600 dark:text-cyan-500 hover:text-cyan-400 underline transition-all ease-in-out duration-200"
            href={'/log-in'}
          >
            Log In to your Account
          </Link>
        </div>
      </div>
    </MaxWidthContainer>
  )
}

'use client';

import Link from "next/link";
import OTPForm from "../auth/OTPForm";
import { DefaultLogo } from "../components/DefaultLogo";
import MaxWidthContainer from "../components/MaxContainer";

export default function SignUpVerification({
  email,
  completionEndPoint,
  className
}: {
  email: string,
  completionEndPoint: string,
  className?: string
}) {

  return (  
    <MaxWidthContainer className={className}>
      <div className="flex flex-col justify-center items-center gap-5 my-14 md:my-20 max-w-100 sm:max-w-150 md:max-w-225 lg:max-w-none">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
          <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 p-6">
            <div className="flex flex-col justify-center items-center gap-2">
              <DefaultLogo className="size-10 sm:size-15 md:size-30 fill-cyan-500" />
              <h1 className="text-lg text-center font-bold">Verify Your Email</h1>
            </div>
          </div>
          <div className="flex flex-col gap-5 w-[calc(100%-3rem)] md:w-2/3 lg:w-2/5 xl:w-1/3 p-5 mx-6 md:ml-0 md:mr-6 bg-gray-100 dark:bg-gray-950 border-1 border-[#171717] dark:border-[#ededed] rounded-lg">
            <OTPForm 
              email={email}
              otpEndPoint="/verification"
              otpSent={false} 
            />
            <div className="relative flex justify-center w-full before:absolute before:top-1/2 before:left-1/10 before:block before:content-[' '] before:w-1/4 before:h-[0.5px] before:bg-[#171717] dark:before:bg-[#ededed] after:absolute after:top-1/2 after:right-1/10 after:block after:content-[' '] after:w-1/4 after:h-[0.5px] after:bg-[#171717] dark:after:bg-[#ededed]">
              <div className="size-1 rounded-full bg-[#171717] dark:bg-[#ededed]"></div>
            </div>
            <div className="flex flex-col gap-2">
              <Link 
                className="self-start"
                href={completionEndPoint}
              >
                <button
                  className="text-left cursor-pointer"
                  type="button"
                >
                  Skip Verification
                </button>
              </Link>
              <span className="text-[0.75rem] text-justify italic before:mr-0.5 before:content-['*']">Skipping this verification step will lead to your Account being deleted in 7 days from Account Sign Up date and You will NOT have access to the other Services provided by Rebottal until you complete Email Verification for this Account. You can perform Email Verification for this Account at a later time, however it must be done before the 7 day deadline.</span>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthContainer>
  );
}

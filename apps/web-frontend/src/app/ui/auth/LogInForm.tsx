'use client';

import { FieldErrors, SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { logInFormSchema, LogInUser } from "@rebottal/app-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { getRecaptchaToken } from "@/app/lib/auth/recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LogInForm() {
  
  const router = useRouter();
  const [failedLogIn, setFailedLogIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LogInUser>({
    resolver: zodResolver(logInFormSchema),
  });

  const submitLogIn: SubmitHandler<LogInUser> = async (data) => {
    setFailedLogIn(() => false);

    const rawInput: LogInUser = {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
      rememberMe: data.rememberMe.toString() === 'true' ? true : false,
    };

    const validatedFields = logInFormSchema.safeParse(rawInput);
    if (!validatedFields.success) {
      setFailedLogIn(() => true);
      return;
    }

    if (validatedFields.data.usernameOrEmail === '' || validatedFields.data.password === '') {
      setFailedLogIn(() => true);
      return;
    }

    const logInData: LogInUser = {
      usernameOrEmail: validatedFields.data.usernameOrEmail,
      password: validatedFields.data.password,
      rememberMe: validatedFields.data.rememberMe
    };

    const recaptchaToken = await getRecaptchaToken();
    
    try {
      const response = await axios.post(
        '/api/auth/log-in', 
        logInData,
        {
          headers: {
            'x-recaptcha-token': recaptchaToken
          }
        }
      );

      if (response.status === 200) {
        router.push('/');
      }
    } catch (error: any) {
      if (error.status === 401) {
        setFailedLogIn(() => true);
      }
    }
  }

  return (
    <form 
      className="flex flex-col gap-1"
      onSubmit={handleSubmit(submitLogIn)}
    >
      <UsernameOrEmailInput 
        register={register} 
        errors={errors}
      />
      <PasswordInput 
        register={register} 
        errors={errors}
      />
      <p className="h-4 text-[0.75rem] text-red-500">{failedLogIn && 'Incorrect Username/Email or Password.'}</p>
      <RememberMeInput register={register} />
      <button 
        className="h-8 p-1 mb-2 text-sm lg:text-base font-bold text-[#171717] bg-cyan-500 hover:bg-cyan-400 rounded-md cursor-pointer transition-all ease-in-out duration-200" 
        type="submit"
      >
        {!isSubmitting ? 'Log In' : 'Processing'}
      </button>
      <input type="submit" hidden />
      <p className="text-sm lg:text-base [&>a]:text-cyan-600 [&>a]:dark:text-cyan-500 [&>a]:hover:text-cyan-400 [&>a]:underline [&>a]:transition-all [&>a]:ease-in-out [&>a]:duration-200">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
    </form>
  );
}

function UsernameOrEmailInput({
  register,
  errors
}: {
  register: UseFormRegister<LogInUser>,
  errors: FieldErrors<LogInUser>,
}) {

  return (
    <>
      <label
        className="text-sm lg:text-base font-bold after:ml-0.5 after:text-red-500 after:content-['*']" 
        htmlFor="usernameOrEmail"
      >
        Username or Email
      </label>
      <input 
        className="p-1 px-2 mb-2 text-sm lg:text-base bg-[#ededed] dark:bg-[#171717] border-1 border-gray-500 rounded-md"
        type="text" 
        {...register('usernameOrEmail')}
        autoComplete="off"
      />
    </>
  );
}

function PasswordInput({
  register,
  errors
}: {
  register: UseFormRegister<LogInUser>,
  errors: FieldErrors<LogInUser>,
}) {

  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-between">
        <label 
          className="text-sm lg:text-base font-bold after:ml-0.5 after:text-red-500 after:content-['*']" 
          htmlFor="password"
        >
          Password
        </label>
        <Link
          className="text-sm lg:text-base text-right text-cyan-600 dark:text-cyan-500 hover:text-cyan-400 underline transition-all ease-in-out duration-200"
          href='/'
        >
          Forgot Password?
        </Link>
      </div>
      <div className="flex justify-between bg-[#ededed] dark:bg-[#171717] border-1 border-gray-500 rounded-md">
        <input 
          className="flex-1 w-full p-1 px-2 text-sm lg:text-base"
          type={passwordVisibility ? 'text' : 'password'} 
          {...register('password')}
          autoComplete="off"
        />
        <button 
          className="px-2 cursor-pointer hover:[&>*]:text-cyan-500 hover:[&>*]:scale-110 [&>*]:transition-all [&>*]:ease-in-out [&>*]:duration-150"
          type="button" 
          onClick={() => setPasswordVisibility(!passwordVisibility)}
        >
          <FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} />
        </button>
      </div>
    </>
  );
}

function RememberMeInput({
  register,
}: {
  register: UseFormRegister<LogInUser>,
}) {

  return (
    <>
      <div className="flex flex-1 items-center gap-2">
        <label
          className="text-sm lg:text-base"
          htmlFor="rememberMe"
        >
          Remember Me?
        </label>
        <input 
          className="size-3 cursor-pointer"
          type="checkbox" 
          {...register('rememberMe')}
        />
      </div>
    </>
  );
}
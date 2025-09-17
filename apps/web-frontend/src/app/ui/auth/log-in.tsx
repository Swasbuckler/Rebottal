'use client';

import { FieldErrors, SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { logInFormSchema, LogInUser } from "@rebottal/app-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

export default function LogInForm() {
  
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LogInUser>({
    resolver: zodResolver(logInFormSchema),
  });

  const submitLogIn: SubmitHandler<LogInUser> = async (data) => {
    const rawInput: LogInUser = {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
      rememberMe: data.rememberMe.toString() === 'true' ? true : false,
    };

    const validatedFields = logInFormSchema.safeParse(rawInput);
    if (!validatedFields.success) {
      return;
    }

    const logInData: LogInUser = {
      usernameOrEmail: validatedFields.data.usernameOrEmail,
      password: validatedFields.data.password,
      rememberMe: validatedFields.data.rememberMe
    };
    
    await axios.post(
      '/api/auth/log-in', 
      logInData
    );
  }

  return (
    <form 
      className="flex flex-col"
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
      <RememberMeInput register={register} />
      <button type="submit">{!isSubmitting ? 'Log In' : 'Processing'}</button>
      <input type="submit" hidden />
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
      <label htmlFor="usernameOrEmail">Enter Username or Email</label>
      <input 
        type="text" 
        {...register('usernameOrEmail')}
        placeholder="Enter Username or Email"
        autoComplete="off"
      />
      <p className="text-red-500">{errors.usernameOrEmail && errors.usernameOrEmail.message}</p>
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
      <label htmlFor="password">Enter Password</label>
      <input 
        type={passwordVisibility ? 'text' : 'password'} 
        {...register('password')}
        placeholder="Enter Password"
        autoComplete="off"
      />
      <button type="button" onClick={() => setPasswordVisibility(!passwordVisibility)}>Reveal</button>
      <p className="text-red-500">{errors.password && errors.password.message}</p>
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
      <label htmlFor="rememberMe">Remember Me?</label>
      <input 
        type="checkbox" 
        {...register('rememberMe')}
      />
    </>
  );
}
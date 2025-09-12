'use client';

import { SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { logInFormSchema, LogInUser } from "@rebottal/app-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

export default function LogInForm() {
  
  const {
    register,
    handleSubmit,
    formState: {isSubmitting},
  } = useForm<LogInUser>({
    resolver: zodResolver(logInFormSchema),
  });

  const submitLogIn: SubmitHandler<LogInUser> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([field, value]) => {
      formData.append(field, value.toString())
    });

    await axios.post(
      '/api/auth/log-in', 
      formData
    );
  }

  return (
    <form 
      className="flex flex-col"
      onSubmit={handleSubmit(submitLogIn)}
    >
      <UsernameOrEmailInput register={register} />
      <PasswordInput register={register} />
      <RememberMeInput register={register} />
      <button type="submit">{!isSubmitting ? 'Log In' : 'Processing'}</button>
      <input type="submit" hidden />
    </form>
  );
}

function UsernameOrEmailInput({
  register,
}: {
  register: UseFormRegister<LogInUser>,
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
    </>
  );
}

function PasswordInput({
  register,
}: {
  register: UseFormRegister<LogInUser>,
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
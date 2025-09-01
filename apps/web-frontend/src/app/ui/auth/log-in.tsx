'use client';

import { SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { logInFormSchema, LogInUser } from "@rebottal/validation-definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { logIn } from "../../actions/auth";
import { useState } from "react";

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
    Object.keys(data).forEach((field) => {
      formData.append(field, data[field as keyof typeof data])
    });
    await logIn(formData);
  }

  return (
    <form 
      className="flex flex-col"
      onSubmit={handleSubmit(submitLogIn)}
    >
      <UsernameOrEmailInput register={register} />
      <PasswordInput register={register} />
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
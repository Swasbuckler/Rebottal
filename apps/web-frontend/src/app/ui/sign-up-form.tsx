'use client';

import { useEffect, useState } from "react";
import { signUp } from "../actions/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { passwordErrorsArray, signUpFormSchema, SignUpFormSchema } from "../lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpForm() {
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting, touchedFields},
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    criteriaMode: 'all',
    mode: 'all'
  });
  const [errorArray, setErrorArray] = useState<string[]>(passwordErrorsArray);

  const submitSignUp: SubmitHandler<SignUpFormSchema> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((field) => {
      formData.append(field, data[field as keyof typeof data])
    });
    await signUp(formData);
  }

  useEffect(() => {
    setErrorArray(errors.password?.types ? passwordErrorsArray.filter((element) => Object.values(errors.password?.types!).flat().includes(element)) : []);
  }, [errors.password?.types])
  
  return (
    <form 
      className="flex flex-col"
      onSubmit={handleSubmit(submitSignUp)}
    >
      <label htmlFor="username">Enter Username</label>
      <input 
        type="text" 
        {...register('username')}
        placeholder="Enter Username"
        autoComplete="off"
      />
      <p className="text-red-500">{errors.username && errors.username.message}</p>
      <label htmlFor="email">Enter Email</label>
      <input 
        type="email" 
        {...register('email')}
        placeholder="Enter Email"
        autoComplete="off"
      />
      <p className="text-red-500">{errors.email && errors.email.message}</p>
      <label htmlFor="password">Enter Password</label>
      <input 
        type="password" 
        {...register('password')}
        placeholder="Enter Password"
        autoComplete="off"
      />
      <div>
        <p>Password must:</p>
        <ul>
          {passwordErrorsArray.map((error) => (
            <li key={error} className={errorArray.includes(error) || !touchedFields.password ? 'text-red-500' : 'text-green-500'}>- {error}</li>
          ))}
        </ul>
      </div>
      <label htmlFor="confirm">Confirm Password</label>
      <input 
        type="password" 
        {...register('confirm')}
        placeholder="Re-enter Password"
        autoComplete="off"
      />
      <p className="text-red-500">{errors.confirm && errors.confirm.message}</p>
      <button type="submit">Sign Up</button>
      <input type="submit" hidden />
      <button type="button" onClick={() => {
        console.log(errors)
      }}>click</button>
    </form>
  );
}
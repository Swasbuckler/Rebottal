'use server';

import { logInFormSchema, LogInUser, SignUpUser, signUpFormSchema, CreateUser } from "@rebottal/validation-definitions";

export async function signUp(formData: FormData) {

  const rawInput: SignUpUser = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm: formData.get('confirm') as string,
  };

  const validatedFields = signUpFormSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return;
  }

  const signUpData: CreateUser = {
    username: validatedFields.data.username,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  };

  await fetch(process.env.BACKEND_URL! + '/auth/sign-up', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(signUpData),
  });
}

export async function logIn(formData: FormData) {

  const rawInput: LogInUser = {
    usernameOrEmail: formData.get('usernameOrEmail') as string,
    password: formData.get('password') as string,
  };

  const validatedFields = logInFormSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return;
  }

  const logInData: LogInUser = {
    usernameOrEmail: validatedFields.data?.usernameOrEmail,
    password: validatedFields.data.password,
  };

  const response = await fetch(process.env.BACKEND_URL! + '/auth/log-in', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(logInData),
  });
  return await response.json();
}
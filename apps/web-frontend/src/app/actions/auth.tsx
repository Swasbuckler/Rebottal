'use server';

import { SignUpFormSchema, signUpFormSchema } from "../lib/definitions";
import { CheckString, CreateUser } from "@rebottal/interfaces";

export async function signUp(formData: FormData) {

  const rawInput: SignUpFormSchema = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm: formData.get('confirm') as string,
  }

  const validatedFields = signUpFormSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return;
  }

  const signUpData: CreateUser = {
    username: validatedFields.data.username,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  }

  await fetch(process.env.BACKEND_URL! + '/auth/signup', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(signUpData),
  });
}

export async function checkUsername(username: CheckString) {
  const response = await fetch(process.env.BACKEND_URL! + '/users/check-username', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(username),
  });
  return await response.json();
}

export async function checkEmail(email: CheckString) {
  const response = await fetch(process.env.BACKEND_URL! + '/users/check-email', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(email),
  });
  return await response.json();
}

export async function logIn(formData: FormData) {

}
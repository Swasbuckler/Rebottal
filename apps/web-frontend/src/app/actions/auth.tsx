'use server';

import { SignUpFormSchema, signUpFormSchema } from "../lib/definitions";
import z from "zod";
import { CreateUser } from "@rebottal/interfaces";

export async function signUp(formData: FormData) {

  const rawInput: SignUpFormSchema = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm: formData.get('confirm') as string,
  }

  const validatedFields = signUpFormSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error),
      inputs: rawInput
    }
  }

  const registerApiURL = process.env.BACKEND_URL! + '/auth/register';
  const registerData: CreateUser = {
    username: validatedFields.data.username,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  }

  await fetch(registerApiURL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(registerData),
  });

}
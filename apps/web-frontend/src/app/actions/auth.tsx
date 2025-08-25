'use server';

import { SignUpFormSchema, signUpFormSchema } from "../lib/definitions";
import z from "zod";

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

}
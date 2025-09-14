import { CreateUser, signUpFormSchema, SignUpUser } from "@rebottal/app-definitions";
import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();

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
  
  const response = await axios.post(
    process.env.BACKEND_URL! + '/auth/sign-up', 
    signUpData,
  );

  return new Response(response.data);
}
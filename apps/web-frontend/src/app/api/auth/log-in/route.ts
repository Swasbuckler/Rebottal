import { CreateUser, LogInUser, logInFormSchema } from "@rebottal/validation-definitions";
import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();

  const rawInput: LogInUser = {
    usernameOrEmail: formData.get('usernameOrEmail') as string,
    password: formData.get('password') as string,
  };

  const validatedFields = logInFormSchema.safeParse(rawInput);
  
  if (!validatedFields.success) {
    return;
  }
  
  const logInData: LogInUser = {
    usernameOrEmail: validatedFields.data.usernameOrEmail,
    password: validatedFields.data.password,
  };
  
  const response = await axios.post(
    process.env.BACKEND_URL! + '/auth/log-in', 
    logInData
  );

  const nextRes = new Response(response.data);
  response.headers["set-cookie"]!.forEach((cookieString: string) => {
    nextRes.headers.append('set-cookie', cookieString);
  });
  return nextRes;
}
import { parseCookie } from "@/app/lib/utils/cookie-parser";
import { LogInUser, logInFormSchema } from "@rebottal/validation-definitions";
import axios from "axios";
import { cookies } from "next/headers";
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

  const cookieStore = await cookies();

  response.headers['set-cookie']!.forEach((cookieString: string) => {
    const parsedCookie = parseCookie(cookieString);
    
    cookieStore.set({
      name: parsedCookie.name,
      value: parsedCookie.value,
      httpOnly: parsedCookie.httpOnly,
      secure: parsedCookie.secure,
      expires: parsedCookie.expires
    });
  });
  return new Response(response.data);
}
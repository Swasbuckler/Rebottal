import axiosInstance from "@/app/lib/auth/axios-instance";
import { parseCookie } from "@/app/lib/utils/cookie-parser";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = await axiosInstance.post(
    '/auth/log-out'
  );
  
  const cookieStore = await cookies();
  
  response.headers['set-cookie']!.forEach((cookieString: string) => {
    const parsedCookie = parseCookie(cookieString);
      
    cookieStore.set({
      name: parsedCookie.name,
      value: parsedCookie.value,
      expires: parsedCookie.expires
    });
  });

  return new Response(response.data);
}
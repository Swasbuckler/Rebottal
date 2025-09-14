import axiosInstance from "@/app/lib/auth/axios-instance";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = await axiosInstance.post(
    '/auth/verification/request'
  );

  return new Response(response.data);
}
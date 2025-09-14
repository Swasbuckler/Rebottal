import axiosInstance from "@/app/lib/auth/axios-instance";
import { SubmitOTPCode, submitOTPCodeSchema } from "@rebottal/app-definitions";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();

  const rawInput: SubmitOTPCode = {
    otpCode: formData.get('otpCode') as string,
  };

  const validatedFields = submitOTPCodeSchema.safeParse(rawInput);
  if (!validatedFields.success) {
    return;
  }

  const otpData: SubmitOTPCode = {
    otpCode: formData.get('otpCode') as string,
  };

  const response = await axiosInstance.post(
    '/auth/verification/submit',
    otpData
  );

  return new Response(response.data);
}
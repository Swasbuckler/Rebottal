import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = await axios.post(
    process.env.BACKEND_URL! + '/user/check/email',
    await request.json()
  );
  return new Response(response.data);
}
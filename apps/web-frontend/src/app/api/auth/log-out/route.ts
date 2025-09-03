import axios from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = await axios.post(
    process.env.BACKEND_URL! + '/auth/log-out', 
    {},
    {
      headers: {
        'cookie': request.headers.get('cookie')
      }
    }
  );
  
  const nextRes = new Response(response.data);
  response.headers["set-cookie"]!.forEach((cookieString: string) => {
    nextRes.headers.append('set-cookie', cookieString);
  });
  return nextRes;
}
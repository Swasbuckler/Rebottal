import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const resClone = request.clone();
  console.log(await resClone.json())
  const response = await fetch(process.env.BACKEND_URL! + '/users/check-email', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(await request.json()),
  });
  return new Response(await response.json());
}
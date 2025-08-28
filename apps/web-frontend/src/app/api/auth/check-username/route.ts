import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = await fetch(process.env.BACKEND_URL! + '/users/check-username', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(await request.json()),
  });
  return new Response(await response.json());
}
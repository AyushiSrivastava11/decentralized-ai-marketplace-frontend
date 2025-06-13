import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { aiWorkerId, cycles } = body;

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const cookieStore = await cookies(); // 🔥 get browser cookies manually
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_URL}/api/v1/payment/create-order`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      credentials: 'include',
    cache: 'no-store',
      // "Cookie": `token=${token}` // Include token in headers
     },
    // credentials: "include",
    body: JSON.stringify({ aiWorkerId, cycles }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

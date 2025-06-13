import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const cookieStore = await cookies(); // 🔥 get browser cookies manually
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_URL}/api/v1/payment/verify`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Cookie": `token=${token}` // Include token in headers
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

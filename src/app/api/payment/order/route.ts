
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { aiWorkerId, cycles } = body;

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieStore =cookies() as any; // ✅ Don't need to await cookies()

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/api/v1/payment/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${token}`, 
    },
    cache: "no-store",
    body: JSON.stringify({ aiWorkerId, cycles }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}

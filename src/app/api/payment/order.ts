import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { aiWorkerId, cycles } = body;

  const res = await fetch("http://localhost:3000/api/v1/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ aiWorkerId, cycles }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

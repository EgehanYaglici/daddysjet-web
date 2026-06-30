import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken, getAuthHeader } from "@/lib/auth";

export async function GET() {
  const rate = await prisma.exchangeRate.findFirst({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rate ?? { usdToTry: 32.5, margin: 0.025 });
}

export async function POST(req: NextRequest) {
  const token = getAuthHeader(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getUserFromToken(token);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { usdToTry, margin } = await req.json();

  const rate = await prisma.exchangeRate.create({
    data: { usdToTry, margin: margin ?? 0.025, setByAdmin: user.email },
  });

  return NextResponse.json(rate, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, getAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getAuthHeader(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
  });
}

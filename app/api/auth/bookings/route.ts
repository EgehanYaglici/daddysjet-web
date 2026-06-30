import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, getAuthHeader } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = getAuthHeader(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      flight: {
        include: { operator: { select: { code: true, rating: true, trusted: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

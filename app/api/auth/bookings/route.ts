import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get("dj_access_token")?.value ??
    (req.headers.get("authorization")?.startsWith("Bearer ")
      ? req.headers.get("authorization")!.slice(7)
      : null);

  if (!token) return NextResponse.json({ bookings: [] });

  const user = await getUserFromToken(token);
  if (!user) return NextResponse.json({ bookings: [] });

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      flight: {
        select: {
          fromCity: true,
          toCity: true,
          departureAt: true,
          priceUSD: true,
          aircraft: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ bookings: JSON.parse(JSON.stringify(bookings)) });
}

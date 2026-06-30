import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      flight: {
        select: { fromCode: true, toCode: true, departureAt: true },
      },
    },
  });
  return NextResponse.json(bookings);
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const flight = await prisma.flight.findFirst({
    where: { OR: [{ id }, { externalId: id }] },
    include: {
      operator: {
        select: { code: true, rating: true, reviewCount: true, trusted: true, flightCount: true },
      },
      reviews: {
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!flight) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(flight);
}

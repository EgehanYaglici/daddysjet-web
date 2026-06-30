import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fromCode = searchParams.get("from");
  const toCode   = searchParams.get("to");
  const category = searchParams.get("category");
  const maxPrice = searchParams.get("maxPrice");
  const petFriendly = searchParams.get("petFriendly");
  const hotDeals = searchParams.get("hotDeals");

  const flights = await prisma.flight.findMany({
    where: {
      status: "AVAILABLE",
      departureAt: { gte: new Date() },
      ...(fromCode ? { fromCode: { equals: fromCode, mode: "insensitive" } } : {}),
      ...(toCode   ? { toCode:   { equals: toCode,   mode: "insensitive" } } : {}),
      ...(category ? { category: category as any } : {}),
      ...(maxPrice ? { priceUSD: { lte: parseInt(maxPrice) } } : {}),
      ...(petFriendly === "true" ? { petFriendly: true } : {}),
      ...(hotDeals === "true" ? { isHotDeal: true } : {}),
    },
    include: {
      operator: {
        select: { code: true, rating: true, reviewCount: true, trusted: true, flightCount: true },
      },
    },
    orderBy: [{ isHotDeal: "desc" }, { departureAt: "asc" }],
    take: 50,
  });

  return NextResponse.json(flights);
}

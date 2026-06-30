import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken, getAuthHeader } from "@/lib/auth";

async function requireAdmin(req: NextRequest) {
  const token = getAuthHeader(req);
  if (!token) return null;
  const user = await getUserFromToken(token);
  if (!user || !["ADMIN", "OPERATOR_RELATIONS"].includes(user.role)) return null;
  return user;
}

// List all flights (admin sees all statuses)
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const flights = await prisma.flight.findMany({
    include: { operator: true, _count: { select: { bookings: true } } },
    orderBy: { departureAt: "asc" },
  });

  return NextResponse.json(flights);
}

// Add a new flight
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  // Find or create operator
  let operator = await prisma.operator.findUnique({ where: { code: body.operatorCode } });
  if (!operator) {
    operator = await prisma.operator.create({
      data: {
        code: body.operatorCode,
        name: body.operatorName ?? body.operatorCode,
        trusted: body.trusted ?? false,
      },
    });
  }

  const flight = await prisma.flight.create({
    data: {
      externalId: body.externalId ?? null,
      operatorId: operator.id,
      fromCity: body.fromCity,
      fromCode: body.fromCode,
      fromAirport: body.fromAirport ?? body.fromCity,
      toCity: body.toCity,
      toCode: body.toCode,
      toAirport: body.toAirport ?? body.toCity,
      departureAt: new Date(body.departureAt),
      durationHrs: body.durationHrs,
      aircraft: body.aircraft,
      category: body.category,
      capacity: body.capacity,
      baggage: body.baggage ?? "Standart",
      priceUSD: body.priceUSD,
      listUSD: body.listUSD,
      petFriendly: body.petFriendly ?? null,
      isHotDeal: body.isHotDeal ?? false,
      tags: body.tags ?? [],
      scene: body.scene ?? "istanbul",
      photoKeys: body.photoKeys ?? [],
      expiresAt: new Date(body.departureAt),
    },
  });

  return NextResponse.json(flight, { status: 201 });
}

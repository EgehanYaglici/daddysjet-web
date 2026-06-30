import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken, getAuthHeader } from "@/lib/auth";
import { sendOperatorApprovalEmail } from "@/lib/ses";

async function requireAdmin(req: NextRequest) {
  const token = getAuthHeader(req);
  if (!token) return null;
  const user = await getUserFromToken(token);
  if (!user || !["ADMIN", "OPERATOR_RELATIONS", "CUSTOMER_SERVICE"].includes(user.role)) return null;
  return user;
}

// Update flight (status, price, etc.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const flight = await prisma.flight.update({
    where: { id },
    data: {
      ...(body.status   ? { status: body.status }     : {}),
      ...(body.priceUSD ? { priceUSD: body.priceUSD } : {}),
      ...(body.isHotDeal !== undefined ? { isHotDeal: body.isHotDeal } : {}),
    },
  });

  return NextResponse.json(flight);
}

// Approve booking (operator said yes) — triggers email with payment link
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params; // this is bookingId when action=approve
  const { action, bookingId } = await req.json();

  if (action === "approve_booking") {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "OPERATOR_APPROVED" },
      include: { flight: true },
    });

    const paymentLink = `${process.env.NEXT_PUBLIC_BASE_URL}/portal?pnr=${booking.pnr}&pay=1`;

    await sendOperatorApprovalEmail({
      to: booking.passengerEmail,
      name: booking.passengerName,
      pnr: booking.pnr,
      flightRoute: `${booking.flight.fromCity} → ${booking.flight.toCity}`,
      departureDate: new Date(booking.flight.departureAt).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
      }),
      paymentLink,
    });

    return NextResponse.json({ ok: true, booking });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  await prisma.flight.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ ok: true });
}

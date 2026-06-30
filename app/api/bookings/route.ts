import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateUniquePNR } from "@/lib/pnr";
import { initIyzicoCheckout } from "@/lib/iyzico";
import { sendBookingConfirmationEmail } from "@/lib/ses";
import { getUserFromToken, getAuthHeader } from "@/lib/auth";
import type { BookingInput } from "@/lib/types";

// Fees
const CARD_FEE_RATE = 0.035;

function calcFee(depositUSD: number, method: BookingInput["paymentMethod"]): number {
  if (method === "CREDIT_CARD") return Math.round(depositUSD * CARD_FEE_RATE);
  return 0;
}

export async function POST(req: NextRequest) {
  const body: BookingInput = await req.json();

  const { flightId, passengerName, passengerEmail, passengerPhone,
          passengerDob, passengerGender, paymentMethod } = body;

  // Validate required fields
  if (!flightId || !passengerName || !passengerEmail || !passengerPhone || !paymentMethod) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Load flight
  const flight = await prisma.flight.findUnique({
    where: { id: flightId },
    include: { operator: true },
  });
  if (!flight) return NextResponse.json({ error: "Flight not found" }, { status: 404 });
  if (flight.status !== "AVAILABLE") {
    return NextResponse.json({ error: "Flight no longer available" }, { status: 409 });
  }

  // Optional: get logged-in user
  const token = getAuthHeader(req);
  const user = token ? await getUserFromToken(token) : null;

  const depositUSD = Math.round(flight.priceUSD * 0.1);
  const feeUSD     = calcFee(depositUSD, paymentMethod);
  const totalUSD   = depositUSD + feeUSD;
  const pnr        = await generateUniquePNR();

  // Create booking (DEPOSIT_PENDING — payment not confirmed yet)
  const booking = await prisma.booking.create({
    data: {
      pnr,
      flightId,
      userId: user?.id ?? null,
      passengerName,
      passengerEmail,
      passengerPhone,
      passengerDob:    passengerDob    ?? null,
      passengerGender: passengerGender ?? null,
      paymentMethod,
      depositUSD,
      totalUSD,
      feeUSD,
      status: "DEPOSIT_PENDING",
    },
  });

  // Lock flight immediately (first-come-first-served)
  await prisma.flight.update({
    where: { id: flightId },
    data: { status: "RESERVED" },
  });

  // Credit card → iyzico checkout form
  if (paymentMethod === "CREDIT_CARD") {
    const [firstName, ...rest] = passengerName.split(" ");
    const lastName = rest.join(" ") || firstName;

    const iyzicoResult = await initIyzicoCheckout({
      price: String(depositUSD),
      paidPrice: String(totalUSD),
      currency: "USD",
      basketId: pnr,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/iyzico-webhook`,
      buyer: {
        id: booking.id,
        name: firstName,
        surname: lastName,
        email: passengerEmail,
        identityNumber: "11111111111",
        registrationAddress: "Istanbul",
        city: "Istanbul",
        country: "Turkey",
        gsmNumber: passengerPhone,
      },
      shippingAddress: { contactName: passengerName, city: "Istanbul", country: "Turkey", address: "Istanbul" },
      billingAddress:  { contactName: passengerName, city: "Istanbul", country: "Turkey", address: "Istanbul" },
      basketItems: [{
        id: flight.id,
        name: `${flight.fromCity} → ${flight.toCity} Depozito`,
        category1: "Havacılık",
        itemType: "VIRTUAL",
        price: String(depositUSD),
      }],
    });

    if (iyzicoResult.status !== "success") {
      // Roll back flight status
      await prisma.flight.update({ where: { id: flightId }, data: { status: "AVAILABLE" } });
      await prisma.booking.delete({ where: { id: booking.id } });
      return NextResponse.json({ error: iyzicoResult.errorMessage ?? "Payment init failed" }, { status: 502 });
    }

    // Store iyzico token
    await prisma.booking.update({
      where: { id: booking.id },
      data: { iyzipayToken: iyzicoResult.token },
    });

    return NextResponse.json({
      pnr,
      bookingId: booking.id,
      paymentMethod: "CREDIT_CARD",
      checkoutFormContent: iyzicoResult.checkoutFormContent,
      token: iyzicoResult.token,
    });
  }

  // Transfer/Swift → send confirmation email, wait for manual confirmation
  await sendBookingConfirmationEmail({
    to: passengerEmail,
    name: passengerName,
    pnr,
    flightRoute: `${flight.fromCity} → ${flight.toCity}`,
    departureDate: new Date(flight.departureAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    depositAmount: `$${depositUSD.toLocaleString()}`,
  });

  return NextResponse.json({ pnr, bookingId: booking.id, paymentMethod, status: "DEPOSIT_PENDING" });
}

// GET — fetch booking by PNR (for confirm/portal page)
export async function GET(req: NextRequest) {
  const pnr = req.nextUrl.searchParams.get("pnr");
  const email = req.nextUrl.searchParams.get("email");

  if (!pnr) return NextResponse.json({ error: "pnr required" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { pnr },
    include: {
      flight: {
        include: { operator: { select: { code: true, rating: true, trusted: true } } },
      },
    },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Gate: must match email (guest) or be authenticated user
  const token = getAuthHeader(req);
  const user = token ? await getUserFromToken(token) : null;

  if (!user && booking.passengerEmail !== email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(booking);
}

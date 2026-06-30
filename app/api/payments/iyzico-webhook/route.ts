import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { retrieveIyzicoCheckout } from "@/lib/iyzico";
import { sendBookingConfirmationEmail } from "@/lib/ses";

// iyzico POSTs here after the user completes the checkout form
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token") as string;
  const status = formData.get("status") as string;

  if (!token) return NextResponse.json({ error: "No token" }, { status: 400 });

  const result = await retrieveIyzicoCheckout(token);

  const booking = await prisma.booking.findFirst({
    where: { iyzipayToken: token },
    include: { flight: true },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  if (result.status === "success" && result.paymentStatus === "SUCCESS") {
    // Mark deposit paid
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "DEPOSIT_PAID",
        iyzipayRef: result.paymentId,
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amountUSD: booking.totalUSD,
        method: "CREDIT_CARD",
        status: "SUCCESS",
        iyzipayRef: result.paymentId,
        metadata: result,
      },
    });

    // Send confirmation email
    await sendBookingConfirmationEmail({
      to: booking.passengerEmail,
      name: booking.passengerName,
      pnr: booking.pnr,
      flightRoute: `${booking.flight.fromCity} → ${booking.flight.toCity}`,
      departureDate: new Date(booking.flight.departureAt).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
      }),
      depositAmount: `$${booking.depositUSD.toLocaleString()}`,
    });

    // Redirect to confirm page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/confirm/${booking.pnr}?status=success`
    );
  } else {
    // Payment failed — release flight
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });
    await prisma.flight.update({
      where: { id: booking.flightId },
      data: { status: "AVAILABLE" },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/confirm/${booking.pnr}?status=failed`
    );
  }
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ConfirmPage({ params }: { params: Promise<{ pnr: string }> }) {
  const { pnr } = await params;

  const booking = await prisma.booking.findUnique({
    where: { pnr },
    include: {
      flight: {
        select: {
          fromCode: true,
          toCode: true,
          fromCity: true,
          toCity: true,
          departureAt: true,
          aircraft: true,
          priceUSD: true,
          category: true,
        },
      },
    },
  });

  const isPaid = booking?.status === "DEPOSIT_PAID" || booking?.status === "OPERATOR_APPROVED" || booking?.status === "FULLY_PAID" || booking?.status === "COMPLETED";
  const isPending = booking?.status === "DEPOSIT_PENDING";

  return (
    <div
      style={{
        background: "var(--color-mist)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 540, width: "100%" }}>
        {/* Success card */}
        {booking ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              border: "1px solid var(--color-line)",
              padding: "48px 44px",
              boxShadow: "0 16px 60px rgba(8,31,65,.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: isPaid ? "#dcfce7" : "var(--color-sky-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                margin: "0 auto 24px",
              }}
            >
              {isPaid ? "✅" : "⏳"}
            </div>

            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "var(--color-navy)",
                letterSpacing: "-0.025em",
                margin: "0 0 10px",
              }}
            >
              {isPaid ? "Rezervasyon Alındı!" : "Talebin Alındı"}
            </h1>

            <p style={{ fontSize: 15, color: "var(--color-muted)", lineHeight: 1.65, margin: "0 0 28px" }}>
              {isPaid
                ? "Depozitonu aldık. Ekibimiz 24 saat içinde seni arayarak onay sürecini tamamlayacak."
                : "Transfer talebini aldık. Ödeme onaylandıktan sonra rezervasyon kilitlenecek."}
            </p>

            {/* PNR */}
            <div
              style={{
                background: "var(--color-sky-50)",
                border: "1.5px dashed var(--color-sky-200)",
                borderRadius: 16,
                padding: "18px",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--color-muted-2)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Rezervasyon Kodu (PNR)
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  letterSpacing: ".08em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pnr}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 6 }}>
                Bu kodu saklayın — rezervasyonunuzu sorgulamak için kullanacaksınız.
              </div>
            </div>

            {/* Flight summary */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 28,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)" }}>
                {booking.flight.fromCode}
              </span>
              <span style={{ fontSize: 16, color: "var(--color-muted-2)" }}>→</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)" }}>
                {booking.flight.toCode}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--color-muted)",
                  fontWeight: 600,
                  marginLeft: 4,
                }}
              >
                {new Date(booking.flight.departureAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Status */}
            <div
              style={{
                background: isPaid ? "#f0fdf4" : "var(--color-mist)",
                borderRadius: 14,
                padding: "14px",
                marginBottom: 28,
                fontSize: 13.5,
                color: isPaid ? "#16a34a" : "var(--color-muted)",
                fontWeight: 700,
              }}
            >
              {isPaid
                ? "Depozito ödendi · Ekibimiz inceliyor"
                : "Ödeme bekleniyor · E-posta talimatlarını takip edin"}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Link
                href="/"
                style={{
                  flex: 1,
                  display: "block",
                  padding: "13px",
                  borderRadius: 12,
                  border: "1.5px solid var(--color-line)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Ana Sayfa
              </Link>
              <a
                href="https://wa.me/905XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "block",
                  padding: "13px",
                  borderRadius: 12,
                  background: "#25D366",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                WhatsApp ile Sor
              </a>
            </div>
          </div>
        ) : (
          // PNR not found
          <div
            style={{
              background: "#fff",
              borderRadius: 28,
              border: "1px solid var(--color-line)",
              padding: "48px 44px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 20 }}>🔍</div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--color-navy)",
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              Rezervasyon Bulunamadı
            </h1>
            <p style={{ fontSize: 15, color: "var(--color-muted)", marginBottom: 28 }}>
              <strong>{pnr}</strong> kodlu rezervasyon bulunamadı. Kodu kontrol edin veya bize ulaşın.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                background: "var(--color-navy)",
                color: "#fff",
                borderRadius: 12,
                padding: "13px 28px",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

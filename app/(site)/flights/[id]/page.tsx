import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric", weekday: "long",
  });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}
function disc(priceUSD: number, listUSD: number) {
  return Math.round((1 - priceUSD / listUSD) * 100);
}

export default async function FlightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const flight = await prisma.flight.findUnique({
    where: { id },
    include: {
      operator: {
        select: { code: true, rating: true, reviewCount: true, trusted: true, flightCount: true },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, rating: true, comment: true, createdAt: true },
      },
    },
  });

  if (!flight) notFound();

  const canBook = flight.status === "AVAILABLE";
  const depositUSD = Math.ceil(flight.priceUSD * 0.10);
  const discPct = disc(flight.priceUSD, flight.listUSD);

  const categoryLabel: Record<string, string> = {
    LIGHT_JET: "Light Jet",
    MIDSIZE_JET: "Midsize Jet",
    SUPER_MIDSIZE: "Super Midsize",
    HEAVY_JET: "Heavy Jet",
    TURBO_PROP: "Turbo Prop",
    HELICOPTER: "Helicopter",
  };

  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Hero / image placeholder */}
      <div
        style={{
          marginTop: -74,
          height: 480,
          background: "linear-gradient(135deg, #050F22 0%, #081F41 50%, #0E3366 100%)",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Decorative orb */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            top: -100,
            right: -60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(21,68,140,.4) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 94, left: 32, display: "flex", gap: 10 }}>
          {flight.isHotDeal && (
            <span
              style={{
                background: "var(--color-ember)",
                color: "#fff",
                borderRadius: 999,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Hot Deal
            </span>
          )}
          {flight.operator.trusted && (
            <span
              style={{
                background: "rgba(255,255,255,.14)",
                color: "#fff",
                borderRadius: 999,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,.2)",
              }}
            >
              Onaylı Operatör
            </span>
          )}
          {!canBook && (
            <span
              style={{
                background: "rgba(255,80,80,.18)",
                color: "#ff9999",
                borderRadius: 999,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 700,
                border: "1px solid rgba(255,80,80,.3)",
              }}
            >
              {flight.status === "RESERVED" ? "Rezerve" : "Müsait Değil"}
            </span>
          )}
        </div>

        {/* Route display */}
        <div
          style={{
            padding: "36px 32px",
            maxWidth: 1240,
            margin: "0 auto",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 10,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {flight.fromCode}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.65)", fontWeight: 600, marginTop: 4 }}>
                {flight.fromCity}
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.3)" }} />
                <span style={{ fontSize: 24, color: "rgba(255,255,255,.8)" }}>✈</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.3)" }} />
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", fontWeight: 600 }}>
                {flight.durationHrs} saat
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {flight.toCode}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.65)", fontWeight: 600, marginTop: 4 }}>
                {flight.toCity}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginTop: -40, position: "relative" }}>
          {/* Main info */}
          <div style={{ flex: 1 }}>
            {/* Card 1 — Details */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid var(--color-line)",
                padding: "28px",
                marginBottom: 20,
                boxShadow: "0 4px 20px rgba(8,31,65,.07)",
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  margin: "0 0 22px",
                  letterSpacing: "-0.02em",
                }}
              >
                Uçuş Detayları
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px 32px",
                }}
              >
                {[
                  ["Tarih", fmtDate(flight.departureAt.toISOString())],
                  ["Saat", fmtTime(flight.departureAt.toISOString())],
                  ["Uçak", flight.aircraft],
                  ["Sınıf", categoryLabel[flight.category] || flight.category],
                  ["Kapasite", `${flight.capacity} kişi`],
                  ["Bagaj", flight.baggage],
                  ["Kalkış", flight.fromAirport],
                  ["Varış", flight.toAirport],
                  ...(flight.petFriendly ? [["Evcil Hayvan", "Evet"]] : []),
                ].map(([label, val]) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: "var(--color-muted-2)",
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--color-navy)",
                      }}
                    >
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {flight.tags.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
                  {flight.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "var(--color-sky-50)",
                        color: "var(--color-blue)",
                        border: "1px solid var(--color-sky-200)",
                        borderRadius: 999,
                        padding: "4px 12px",
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Card 2 — Operator */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid var(--color-line)",
                padding: "24px 28px",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  margin: "0 0 16px",
                  letterSpacing: "-0.015em",
                }}
              >
                Operatör
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "var(--color-sky-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  ✈
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>
                    {flight.operator.trusted ? "Onaylı Operatör" : "Operatör"}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600, marginTop: 2 }}>
                    {flight.operator.flightCount}+ tamamlanan uçuş · {flight.operator.rating.toFixed(1)} ★ ({flight.operator.reviewCount} yorum)
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--color-muted)", marginTop: 14, lineHeight: 1.65 }}>
                Gizlilik politikamız gereği operatör adı sadece rezervasyon onaylandıktan sonra ekibimiz tarafından paylaşılır.
              </p>
            </div>

            {/* Card 3 — Reviews */}
            {flight.reviews.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: "1px solid var(--color-line)",
                  padding: "24px 28px",
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    margin: "0 0 18px",
                    letterSpacing: "-0.015em",
                  }}
                >
                  Yorumlar
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {flight.reviews.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        borderBottom: "1px solid var(--color-line)",
                        paddingBottom: 16,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 14, color: "var(--color-gold)", fontWeight: 700 }}>
                          {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--color-muted-2)", fontWeight: 600 }}>
                          {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      {r.comment && (
                        <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.6, margin: 0 }}>
                          {r.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div
            style={{
              width: 340,
              flexShrink: 0,
              position: "sticky",
              top: 90,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                border: "1px solid var(--color-line)",
                padding: "28px",
                boxShadow: "0 8px 40px rgba(8,31,65,.1)",
              }}
            >
              {/* Pricing */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--color-muted-2)",
                    fontWeight: 600,
                    textDecoration: "line-through",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {fmt(flight.listUSD)}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <div
                    style={{
                      fontSize: 42,
                      fontWeight: 800,
                      color: "var(--color-navy)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmt(flight.priceUSD)}
                  </div>
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#16a34a",
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    −%{discPct}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600, marginTop: 6 }}>
                  Tüm uçak — {flight.capacity} kişiye kadar
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid var(--color-line)", margin: "18px 0" }} />

              {/* Deposit info */}
              <div
                style={{
                  background: "var(--color-sky-50)",
                  border: "1px solid var(--color-sky-200)",
                  borderRadius: 14,
                  padding: "16px",
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--color-navy)", marginBottom: 6 }}>
                  Şimdi sadece {fmt(depositUSD)} depozito
                </div>
                <div style={{ fontSize: 12.5, color: "var(--color-muted)", lineHeight: 1.6 }}>
                  Toplam fiyatın %10&apos;u. Onay sonrası kalan {fmt(flight.priceUSD - depositUSD)} ödenir.
                </div>
              </div>

              {canBook ? (
                <Link
                  href={`/booking/${flight.id}`}
                  style={{
                    display: "block",
                    background: "var(--color-navy)",
                    color: "#fff",
                    borderRadius: 14,
                    padding: "16px",
                    fontSize: 16,
                    fontWeight: 800,
                    textAlign: "center",
                    textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(8,31,65,.25)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Uçuşu Kilitle →
                </Link>
              ) : (
                <div
                  style={{
                    display: "block",
                    background: "var(--color-line)",
                    color: "var(--color-muted-2)",
                    borderRadius: 14,
                    padding: "16px",
                    fontSize: 16,
                    fontWeight: 800,
                    textAlign: "center",
                    cursor: "not-allowed",
                  }}
                >
                  {flight.status === "RESERVED" ? "Rezerve Edildi" : "Müsait Değil"}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                {["Tam İade", "Güvenli Ödeme", "7/24 Destek"].map((t) => (
                  <div
                    key={t}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--color-muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/905XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 14,
                background: "#25D366",
                color: "#fff",
                borderRadius: 14,
                padding: "14px",
                fontSize: 14.5,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              WhatsApp ile Sor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  pnr: string;
  status: string;
  depositUSD: number;
  totalUSD: number;
  paymentMethod: string;
  flight: {
    fromCode: string;
    toCode: string;
    fromCity: string;
    toCity: string;
    departureAt: string;
    aircraft: string;
  };
}

export default function PortalPage() {
  const router = useRouter();
  const [pnr, setPnr] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBooking(null);
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/bookings?pnr=${encodeURIComponent(pnr)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Rezervasyon bulunamadı.");
      } else {
        setBooking(data);
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  const statusLabel: Record<string, string> = {
    DEPOSIT_PENDING: "Ödeme Bekleniyor",
    DEPOSIT_PAID: "Depozito Ödendi",
    OPERATOR_APPROVED: "Onaylandı",
    FULLY_PAID: "Tam Ödendi",
    CANCELLED: "İptal Edildi",
    COMPLETED: "Tamamlandı",
    REFUNDED: "İade Edildi",
  };

  const statusColor: Record<string, string> = {
    DEPOSIT_PENDING: "#d97706",
    DEPOSIT_PAID: "#2563eb",
    OPERATOR_APPROVED: "#16a34a",
    FULLY_PAID: "#7c3aed",
    CANCELLED: "#dc2626",
    COMPLETED: "#16a34a",
    REFUNDED: "#6b7280",
  };

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
      <div style={{ maxWidth: 480, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--color-navy)",
              letterSpacing: "-0.025em",
              margin: "0 0 8px",
            }}
          >
            Rezervasyonumu Bul
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-muted)", fontWeight: 500 }}>
            PNR kodunuz ve e-postanızla rezervasyonunuzu sorgulayın.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            border: "1px solid var(--color-line)",
            padding: "32px",
            boxShadow: "0 8px 40px rgba(8,31,65,.08)",
            marginBottom: 24,
          }}
        >
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "var(--color-muted-2)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                PNR Kodu
              </label>
              <input
                value={pnr}
                onChange={(e) => setPnr(e.target.value.toUpperCase())}
                placeholder="DJ123456"
                required
                style={{
                  width: "100%",
                  border: "1.5px solid var(--color-line)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                  fontFamily: "inherit",
                  outline: "none",
                  letterSpacing: ".06em",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "var(--color-muted-2)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                style={{
                  width: "100%",
                  border: "1.5px solid var(--color-line)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--color-navy)",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "var(--color-muted-2)" : "var(--color-navy)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "15px",
                fontSize: 15.5,
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Aranıyor..." : "Sorgula →"}
            </button>
          </form>
        </div>

        {/* Booking result */}
        {booking && (
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              border: "1px solid var(--color-line)",
              padding: "28px",
              boxShadow: "0 4px 24px rgba(8,31,65,.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    letterSpacing: ".04em",
                  }}
                >
                  {booking.pnr}
                </div>
                <div style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600, marginTop: 2 }}>
                  Rezervasyon kodu
                </div>
              </div>
              <span
                style={{
                  background: `${statusColor[booking.status]}18`,
                  color: statusColor[booking.status] || "#333",
                  border: `1px solid ${statusColor[booking.status]}40`,
                  borderRadius: 999,
                  padding: "5px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {statusLabel[booking.status] || booking.status}
              </span>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--color-line)", margin: "16px 0" }} />

            {/* Flight info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--color-navy)" }}>
                  {booking.flight.fromCode}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>
                  {booking.flight.fromCity}
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ height: 1, background: "var(--color-line)", width: "100%" }} />
                <span style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>✈</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--color-navy)" }}>
                  {booking.flight.toCode}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>
                  {booking.flight.toCity}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InfoRow label="Tarih" value={new Date(booking.flight.departureAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} />
              <InfoRow label="Uçak" value={booking.flight.aircraft} />
              <InfoRow label="Depozito" value={`$${booking.depositUSD.toLocaleString()}`} />
              <InfoRow label="Toplam" value={`$${booking.totalUSD.toLocaleString()}`} />
            </div>
          </div>
        )}

        {searched && !booking && !error && !loading && (
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--color-muted)" }}>
            Rezervasyon bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--color-muted-2)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-navy)" }}>{value}</div>
    </div>
  );
}

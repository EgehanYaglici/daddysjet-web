"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface BookingPageProps {
  params: Promise<{ flightId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    passengerName: "",
    passengerEmail: "",
    passengerPhone: "",
    passengerDob: "",
    paymentMethod: "CREDIT_CARD" as "CREDIT_CARD" | "TL_TRANSFER" | "USD_SWIFT",
  });
  const [error, setError] = useState("");
  const [flightId, setFlightId] = useState<string | null>(null);

  // Resolve params once
  if (!flightId) {
    params.then(({ flightId: fid }) => setFlightId(fid));
  }

  function set(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!flightId) return;
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, flightId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Bir hata oluştu, lütfen tekrar deneyin.");
      return;
    }

    if (form.paymentMethod === "CREDIT_CARD" && data.checkoutFormContent) {
      // iyzico checkout — inject form and submit
      const wrapper = document.createElement("div");
      wrapper.innerHTML = data.checkoutFormContent;
      document.body.appendChild(wrapper);
      const form = wrapper.querySelector("form");
      if (form) form.submit();
      return;
    }

    // Transfer methods — go to confirm page
    startTransition(() => router.push(`/confirm/${data.pnr}`));
  }

  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 32px 0" }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-muted)",
            fontFamily: "inherit",
            marginBottom: 28,
            padding: 0,
          }}
        >
          ← Uçuşa Geri Dön
        </button>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--color-navy)",
            letterSpacing: "-0.025em",
            margin: "0 0 8px",
          }}
        >
          Rezervasyon
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-muted)", margin: "0 0 36px", fontWeight: 500 }}>
          Bilgilerinizi girin, depozito ödeyin ve uçuşu kilitleyin.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Passenger info */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid var(--color-line)",
              padding: "26px",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-navy)",
                margin: "0 0 22px",
                letterSpacing: "-0.015em",
              }}
            >
              Yolcu Bilgileri
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field
                label="Ad Soyad"
                required
                placeholder="Tam adınız (pasaportla aynı)"
                value={form.passengerName}
                onChange={(v) => set("passengerName", v)}
              />
              <Field
                label="E-posta"
                type="email"
                required
                placeholder="ornek@email.com"
                value={form.passengerEmail}
                onChange={(v) => set("passengerEmail", v)}
              />
              <Field
                label="Telefon"
                type="tel"
                required
                placeholder="+90 5XX XXX XX XX"
                value={form.passengerPhone}
                onChange={(v) => set("passengerPhone", v)}
              />
              <Field
                label="Doğum Tarihi (opsiyonel)"
                type="date"
                value={form.passengerDob}
                onChange={(v) => set("passengerDob", v)}
              />
            </div>
          </div>

          {/* Payment method */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid var(--color-line)",
              padding: "26px",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--color-navy)",
                margin: "0 0 18px",
                letterSpacing: "-0.015em",
              }}
            >
              Ödeme Yöntemi
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(
                [
                  ["CREDIT_CARD", "Kredi Kartı", "Visa, Mastercard, AMEX — iyzico güvencesiyle. +%3.5 işlem ücreti."],
                  ["TL_TRANSFER", "TL Havale / EFT", "Türk bankası üzerinden TL havale. Günlük kur uygulanır."],
                  ["USD_SWIFT", "USD Swift", "USD ile uluslararası banka transferi."],
                ] as const
              ).map(([val, label, desc]) => (
                <label
                  key={val}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "16px",
                    borderRadius: 14,
                    border: `2px solid ${form.paymentMethod === val ? "var(--color-blue)" : "var(--color-line)"}`,
                    cursor: "pointer",
                    background: form.paymentMethod === val ? "var(--color-sky-50)" : "#fff",
                    transition: "border-color .15s, background .15s",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={val}
                    checked={form.paymentMethod === val}
                    onChange={() => set("paymentMethod", val)}
                    style={{ marginTop: 3, accentColor: "var(--color-blue)" }}
                  />
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--color-navy)" }}>{label}</div>
                    <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 3, lineHeight: 1.5 }}>
                      {desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Summary / Guarantee */}
          <div
            style={{
              background: "var(--color-sky-50)",
              border: "1px solid var(--color-sky-200)",
              borderRadius: 16,
              padding: "18px",
              marginBottom: 24,
              fontSize: 13.5,
              color: "var(--color-muted)",
              lineHeight: 1.65,
            }}
          >
            <strong style={{ color: "var(--color-navy)" }}>Ödeme güvencesi:</strong> Depozitonu aldıktan sonra uçuş
            kilitlenir. Operatör reddi veya mücbir sebep durumunda{" "}
            <strong style={{ color: "var(--color-navy)" }}>tam iade</strong> yapılır. 24 saat içinde iptal talebinde
            de tam iade geçerlidir.
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                borderRadius: 12,
                padding: "14px 16px",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !flightId}
            style={{
              width: "100%",
              background: isPending ? "var(--color-muted-2)" : "var(--color-navy)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "17px",
              fontSize: 16,
              fontWeight: 800,
              cursor: isPending ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(8,31,65,.25)",
              letterSpacing: "-0.01em",
              transition: "background .2s",
            }}
          >
            {isPending
              ? "İşleniyor..."
              : form.paymentMethod === "CREDIT_CARD"
              ? "Kart ile Ödemeye Geç →"
              : "Rezervasyonu Başlat →"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--color-muted-2)",
          letterSpacing: ".05em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: "var(--color-ember)" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
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
          background: "#fff",
          boxSizing: "border-box",
          transition: "border-color .15s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-blue)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-line)")}
      />
    </div>
  );
}

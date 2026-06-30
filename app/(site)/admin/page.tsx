"use client";

import { useState, useEffect } from "react";

type Tab = "flights" | "bookings" | "exchange";

interface Flight {
  id: string;
  fromCode: string;
  toCode: string;
  fromCity: string;
  toCity: string;
  departureAt: string;
  aircraft: string;
  priceUSD: number;
  status: string;
  isHotDeal: boolean;
  category: string;
}

interface Booking {
  id: string;
  pnr: string;
  passengerName: string;
  passengerEmail: string;
  status: string;
  depositUSD: number;
  totalUSD: number;
  paymentMethod: string;
  createdAt: string;
  flight: { fromCode: string; toCode: string; departureAt: string };
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "#16a34a",
  RESERVED: "#d97706",
  SOLD: "#7c3aed",
  EXPIRED: "#6b7280",
  DEPOSIT_PENDING: "#d97706",
  DEPOSIT_PAID: "#2563eb",
  OPERATOR_APPROVED: "#16a34a",
  FULLY_PAID: "#7c3aed",
  COMPLETED: "#16a34a",
  CANCELLED: "#dc2626",
  REFUNDED: "#6b7280",
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("flights");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rate, setRate] = useState<number | null>(null);
  const [newRate, setNewRate] = useState("");
  const [loading, setLoading] = useState(false);

  // New flight form
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [flightForm, setFlightForm] = useState({
    operatorCode: "OP-A",
    fromCity: "", fromCode: "", fromAirport: "",
    toCity: "", toCode: "", toAirport: "",
    departureAt: "",
    durationHrs: "",
    aircraft: "",
    category: "MIDSIZE_JET",
    capacity: "7",
    baggage: "",
    priceUSD: "",
    listUSD: "",
    petFriendly: "false",
    isHotDeal: "false",
    scene: "city",
  });

  useEffect(() => {
    if (tab === "flights") fetchFlights();
    if (tab === "bookings") fetchBookings();
    if (tab === "exchange") fetchRate();
  }, [tab]);

  async function fetchFlights() {
    setLoading(true);
    const r = await fetch("/api/admin/flights");
    if (r.ok) setFlights(await r.json());
    setLoading(false);
  }

  async function fetchBookings() {
    setLoading(true);
    const r = await fetch("/api/admin/bookings");
    if (r.ok) setBookings(await r.json());
    setLoading(false);
  }

  async function fetchRate() {
    const r = await fetch("/api/admin/exchange-rate");
    if (r.ok) {
      const d = await r.json();
      setRate(d.rate);
      setNewRate(String(d.rate ?? ""));
    }
  }

  async function handleAddFlight(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...flightForm,
      durationHrs: parseFloat(flightForm.durationHrs),
      capacity: parseInt(flightForm.capacity),
      priceUSD: parseInt(flightForm.priceUSD),
      listUSD: parseInt(flightForm.listUSD),
      petFriendly: flightForm.petFriendly === "true",
      isHotDeal: flightForm.isHotDeal === "true",
    };
    const r = await fetch("/api/admin/flights", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) {
      setShowAddFlight(false);
      fetchFlights();
    }
  }

  async function handleSetRate(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/exchange-rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rate: parseFloat(newRate) }),
    });
    if (r.ok) fetchRate();
  }

  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Admin header */}
      <div
        style={{
          background: "var(--color-navy)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
          Admin Panel
        </span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>
          Daddy&apos;s Jet
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--color-line)",
          display: "flex",
          padding: "0 32px",
        }}
      >
        {(["flights", "bookings", "exchange"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "14px 0",
              marginRight: 28,
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2.5px solid var(--color-blue)" : "2.5px solid transparent",
              fontSize: 14,
              fontWeight: 700,
              color: tab === t ? "var(--color-navy)" : "var(--color-muted)",
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {t === "flights" ? "Uçuşlar" : t === "bookings" ? "Rezervasyonlar" : "Kur"}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px 0" }}>
        {/* ── FLIGHTS TAB ── */}
        {tab === "flights" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
              <button
                onClick={() => setShowAddFlight(!showAddFlight)}
                style={{
                  background: "var(--color-navy)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                + Uçuş Ekle
              </button>
            </div>

            {showAddFlight && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--color-line)",
                  padding: "26px",
                  marginBottom: 24,
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 20px" }}>
                  Yeni Uçuş
                </h3>
                <form onSubmit={handleAddFlight}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                    {[
                      ["operatorCode", "Operatör Kodu"],
                      ["fromCity", "Kalkış Şehir"],
                      ["fromCode", "Kalkış IATA"],
                      ["fromAirport", "Kalkış Havalimanı"],
                      ["toCity", "Varış Şehir"],
                      ["toCode", "Varış IATA"],
                      ["toAirport", "Varış Havalimanı"],
                      ["departureAt", "Kalkış (ISO)"],
                      ["durationHrs", "Süre (saat)"],
                      ["aircraft", "Uçak"],
                      ["capacity", "Kapasite"],
                      ["baggage", "Bagaj"],
                      ["priceUSD", "Fiyat USD"],
                      ["listUSD", "Liste Fiyat USD"],
                    ].map(([k, l]) => (
                      <div key={k}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--color-muted-2)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>
                          {l}
                        </label>
                        <input
                          value={flightForm[k as keyof typeof flightForm]}
                          onChange={(e) => setFlightForm((p) => ({ ...p, [k]: e.target.value }))}
                          style={{ width: "100%", border: "1.5px solid var(--color-line)", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontWeight: 600, fontFamily: "inherit", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--color-muted-2)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>
                        Sınıf
                      </label>
                      <select
                        value={flightForm.category}
                        onChange={(e) => setFlightForm((p) => ({ ...p, category: e.target.value }))}
                        style={{ width: "100%", border: "1.5px solid var(--color-line)", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}
                      >
                        {["LIGHT_JET", "MIDSIZE_JET", "SUPER_MIDSIZE", "HEAVY_JET", "TURBO_PROP"].map((c) => (
                          <option key={c} value={c}>{c.replace("_", " ")}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--color-muted-2)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>
                        Hot Deal
                      </label>
                      <select
                        value={flightForm.isHotDeal}
                        onChange={(e) => setFlightForm((p) => ({ ...p, isHotDeal: e.target.value }))}
                        style={{ width: "100%", border: "1.5px solid var(--color-line)", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}
                      >
                        <option value="false">Hayır</option>
                        <option value="true">Evet</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowAddFlight(false)}
                      style={{ background: "none", border: "1.5px solid var(--color-line)", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      style={{ background: "var(--color-blue)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Ekle
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <p style={{ color: "var(--color-muted)" }}>Yükleniyor...</p>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid var(--color-line)",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-line)", background: "var(--color-mist)" }}>
                      {["Rota", "Uçak", "Tarih", "Fiyat", "Durum", ""].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: "var(--color-muted-2)",
                            letterSpacing: ".05em",
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((f) => (
                      <tr key={f.id} style={{ borderBottom: "1px solid var(--color-line)" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-navy)" }}>
                            {f.fromCode} → {f.toCode}
                          </span>
                          {f.isHotDeal && (
                            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, background: "#fef2f2", color: "var(--color-ember)", borderRadius: 999, padding: "2px 8px" }}>
                              Hot
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13.5, fontWeight: 600, color: "var(--color-muted)" }}>
                          {f.aircraft}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13.5, fontWeight: 600, color: "var(--color-muted)" }}>
                          {new Date(f.departureAt).toLocaleDateString("tr-TR")}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 800, color: "var(--color-navy)", fontVariantNumeric: "tabular-nums" }}>
                          ${f.priceUSD.toLocaleString()}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: STATUS_COLORS[f.status] || "#333",
                              background: `${STATUS_COLORS[f.status]}18`,
                              padding: "4px 10px",
                              borderRadius: 999,
                            }}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <a
                            href={`/flights/${f.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 13, fontWeight: 700, color: "var(--color-blue)" }}
                          >
                            Gör →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {flights.length === 0 && (
                  <p style={{ textAlign: "center", padding: "32px", color: "var(--color-muted)", fontSize: 14 }}>
                    Henüz uçuş yok.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid var(--color-line)",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <p style={{ padding: 32, color: "var(--color-muted)" }}>Yükleniyor...</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-line)", background: "var(--color-mist)" }}>
                    {["PNR", "Yolcu", "Rota", "Tarih", "Depozito", "Durum", "Yöntem"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: "var(--color-muted-2)",
                          letterSpacing: ".05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: "1px solid var(--color-line)" }}>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 800, color: "var(--color-navy)", letterSpacing: ".04em" }}>
                        {b.pnr}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-navy)" }}>{b.passengerName}</div>
                        <div style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>{b.passengerEmail}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "var(--color-navy)" }}>
                        {b.flight.fromCode} → {b.flight.toCode}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--color-muted)", fontWeight: 600 }}>
                        {new Date(b.flight.departureAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 800, color: "var(--color-navy)", fontVariantNumeric: "tabular-nums" }}>
                        ${b.depositUSD.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: STATUS_COLORS[b.status] || "#333",
                            background: `${STATUS_COLORS[b.status]}18`,
                            padding: "4px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--color-muted)", fontWeight: 600 }}>
                        {b.paymentMethod.replace("_", " ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && bookings.length === 0 && (
              <p style={{ textAlign: "center", padding: "32px", color: "var(--color-muted)", fontSize: 14 }}>
                Henüz rezervasyon yok.
              </p>
            )}
          </div>
        )}

        {/* ── EXCHANGE RATE TAB ── */}
        {tab === "exchange" && (
          <div style={{ maxWidth: 420 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid var(--color-line)",
                padding: "28px",
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", margin: "0 0 20px" }}>
                USD → TRY Kuru
              </h2>

              {rate !== null && (
                <div
                  style={{
                    background: "var(--color-sky-50)",
                    border: "1px solid var(--color-sky-200)",
                    borderRadius: 14,
                    padding: "14px 18px",
                    marginBottom: 22,
                  }}
                >
                  <div style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600, marginBottom: 4 }}>
                    Mevcut Kur
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "var(--color-navy)", fontVariantNumeric: "tabular-nums" }}>
                    1 USD = {rate} TRY
                  </div>
                </div>
              )}

              <form onSubmit={handleSetRate}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-muted-2)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>
                  Yeni Kur (TRY)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    border: "1.5px solid var(--color-line)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    marginBottom: 16,
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "var(--color-navy)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "13px",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Kuru Güncelle
                </button>
              </form>

              <p style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 14, lineHeight: 1.6 }}>
                Kura otomatik olarak %2 güvence marjı eklenir ve TL havale hesaplamalarında kullanılır.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

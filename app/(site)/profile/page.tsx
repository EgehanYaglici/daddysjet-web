"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

interface Booking {
  id: string;
  pnr: string;
  status: string;
  depositPaid: number;
  totalPaid: number;
  createdAt: string;
  flight: {
    fromCity: string;
    toCity: string;
    departureAt: string;
    priceUSD: number;
    aircraft: string;
  };
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  DEPOSIT_PENDING:   { label: "Ödeme Bekleniyor", color: "#92400e", bg: "#fef3c7" },
  DEPOSIT_PAID:      { label: "Depozito Ödendi",  color: "#1e40af", bg: "#dbeafe" },
  OPERATOR_APPROVED: { label: "Onaylandı",         color: "#065f46", bg: "#d1fae5" },
  FULLY_PAID:        { label: "Tam Ödendi",        color: "#065f46", bg: "#d1fae5" },
  COMPLETED:         { label: "Tamamlandı",        color: "#374151", bg: "#f3f4f6" },
  CANCELLED:         { label: "İptal",             color: "#7f1d1d", bg: "#fee2e2" },
  REFUNDED:          { label: "İade Edildi",       color: "#581c87", bg: "#f3e8ff" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [tab, setTab] = useState<"bookings" | "security">("bookings");

  // Change password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?return=/profile");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setBookingsLoading(true);
    fetch("/api/auth/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings ?? []))
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [user]);

  async function handleChangePassword() {
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ text: "Yeni şifreler eşleşmiyor.", ok: false });
      return;
    }
    if (newPw.length < 8) {
      setPwMsg({ text: "Şifre en az 8 karakter olmalı.", ok: false });
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg({ text: data.error ?? "Şifre değiştirilemedi.", ok: false });
      } else {
        setPwMsg({ text: "Şifreniz başarıyla güncellendi.", ok: true });
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      }
    } finally {
      setPwLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-mist)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: "var(--color-muted)", fontWeight: 600 }}>Yükleniyor…</div>
      </div>
    );
  }

  if (!user) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14.5,
    fontWeight: 600,
    border: "1.5px solid var(--color-line)",
    borderRadius: 10,
    background: "#fff",
    color: "var(--color-navy)",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-line)", padding: "24px 0" }}>
        <div className="container-page">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1A6FD4, #0f4d9e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: "#fff",
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {(user.name ?? user.email)[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.02em" }}>
                  {user.name ?? "Kullanıcı"}
                </div>
                <div style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600, marginTop: 2 }}>{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                padding: "9px 18px",
                fontSize: 13.5,
                fontWeight: 700,
                background: "none",
                border: "1.5px solid var(--color-line)",
                borderRadius: 10,
                cursor: "pointer",
                color: "var(--color-muted)",
                fontFamily: "inherit",
              }}
            >
              Çıkış Yap
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 24, borderBottom: "none" }}>
            {([["bookings", "Rezervasyonlarım"], ["security", "Güvenlik"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  borderBottom: tab === key ? "2px solid var(--color-blue)" : "2px solid transparent",
                  background: "none",
                  cursor: "pointer",
                  color: tab === key ? "var(--color-blue)" : "var(--color-muted)",
                  fontFamily: "inherit",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page" style={{ paddingTop: 32 }}>

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <>
            {bookingsLoading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-muted)", fontSize: 14, fontWeight: 600 }}>
                Rezervasyonlar yükleniyor…
              </div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✈</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-navy)", marginBottom: 8 }}>Henüz rezervasyon yok</div>
                <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>İlk özel jet deneyiminiz için uçuş arayın.</p>
                <a
                  href="/search"
                  style={{ display: "inline-block", background: "var(--color-navy)", color: "#fff", borderRadius: 12, padding: "13px 28px", fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}
                >
                  Uçuşları Keşfet
                </a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {bookings.map((b) => {
                  const st = STATUS_LABELS[b.status] ?? { label: b.status, color: "#374151", bg: "#f3f4f6" };
                  return (
                    <div key={b.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--color-line)", padding: "22px 24px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.02em" }}>
                            {b.flight.fromCity} → {b.flight.toCity}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600, marginTop: 4 }}>
                            {fmtDate(b.flight.departureAt)} · {b.flight.aircraft}
                          </div>
                          <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--color-muted-2)", fontWeight: 700 }}>
                            PNR: <span style={{ color: "var(--color-navy)", letterSpacing: ".06em" }}>{b.pnr}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ display: "inline-block", padding: "4px 12px", fontSize: 12.5, fontWeight: 700, borderRadius: 99, background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--color-navy)", marginTop: 8 }}>
                            {fmt(b.flight.priceUSD)}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>
                            Depozito: {fmt(b.depositPaid)}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        <a
                          href={`/confirm/${b.pnr}`}
                          style={{ padding: "9px 18px", fontSize: 13, fontWeight: 700, background: "var(--color-mist)", color: "var(--color-navy)", borderRadius: 10, textDecoration: "none", border: "1px solid var(--color-line)" }}
                        >
                          Detaylar →
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── SECURITY TAB ── */}
        {tab === "security" && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--color-line)", padding: "28px 28px" }}>
              <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.02em" }}>
                Şifre Değiştir
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-muted-2)", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 7 }}>
                    Mevcut Şifre
                  </label>
                  <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} style={inputStyle} autoComplete="current-password" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-muted-2)", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 7 }}>
                    Yeni Şifre
                  </label>
                  <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={inputStyle} autoComplete="new-password" placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--color-muted-2)", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 7 }}>
                    Yeni Şifre (Tekrar)
                  </label>
                  <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} style={inputStyle} autoComplete="new-password" placeholder="••••••••" />
                </div>
              </div>

              {pwMsg && (
                <div style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  background: pwMsg.ok ? "rgba(74,222,128,.12)" : "rgba(239,68,68,.1)",
                  border: `1px solid ${pwMsg.ok ? "rgba(74,222,128,.3)" : "rgba(239,68,68,.25)"}`,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: pwMsg.ok ? "#065f46" : "#dc2626",
                }}>
                  {pwMsg.text}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                style={{
                  marginTop: 22,
                  width: "100%",
                  padding: "13px",
                  fontSize: 14.5,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, var(--color-navy), #1A6FD4)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  cursor: pwLoading ? "not-allowed" : "pointer",
                  opacity: pwLoading || !currentPw || !newPw || !confirmPw ? 0.6 : 1,
                  fontFamily: "inherit",
                }}
              >
                {pwLoading ? "Kaydediliyor…" : "Şifreyi Güncelle"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

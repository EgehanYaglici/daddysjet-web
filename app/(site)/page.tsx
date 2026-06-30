import { prisma } from "@/lib/prisma";
import { FlightCard } from "@/components/flights/FlightCard";
import { SearchBarServer } from "@/components/ui/SearchBarServer";
import type { FlightWithOperator } from "@/lib/types";

export const revalidate = 60;

async function getHotFlights(): Promise<FlightWithOperator[]> {
  const flights = await prisma.flight.findMany({
    where: { status: "AVAILABLE", isHotDeal: true, departureAt: { gte: new Date() } },
    include: { operator: { select: { code: true, rating: true, reviewCount: true, trusted: true, flightCount: true } } },
    orderBy: { departureAt: "asc" },
    take: 6,
  });
  return JSON.parse(JSON.stringify(flights));
}

async function getAllFlights(): Promise<FlightWithOperator[]> {
  const flights = await prisma.flight.findMany({
    where: { status: "AVAILABLE", departureAt: { gte: new Date() } },
    include: { operator: { select: { code: true, rating: true, reviewCount: true, trusted: true, flightCount: true } } },
    orderBy: [{ isHotDeal: "desc" }, { departureAt: "asc" }],
    take: 8,
  });
  return JSON.parse(JSON.stringify(flights));
}

export default async function HomePage() {
  const [hotFlights, allFlights] = await Promise.all([getHotFlights(), getAllFlights()]);
  const hotCount = hotFlights.length;

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div style={{ position: "absolute", width: 800, height: 800, top: -200, right: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(21,68,140,.35) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 500, height: 500, bottom: -100, left: -50, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,142,61,.15) 0%, transparent 60%)", pointerEvents: "none" }} />

        <div className="hero-inner">
          {hotCount > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 700, marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 0 2px rgba(74,222,128,.3)" }} />
              Şu an {hotCount} hot deal · canlı fiyatlar
            </div>
          )}

          <h1 className="hero-title">
            Özel jet,{" "}
            <span style={{ color: "var(--color-gold)" }}>uçak fiyatına.</span>
          </h1>

          <p className="hero-sub">
            Türkiye&apos;deki yetkili operatörlerden boş bacak uçuşları. Tüm uçak sizin — ticari uçuşun birkaç katı fiyatla.
          </p>

          <SearchBarServer />

          <div className="hero-stats">
            {[["8+", "Yetkili operatör"], ["240+", "Tamamlanan uçuş"], ["4.9 ★", "Ortalama puan"], ["%100", "İade garantisi"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", fontWeight: 600, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOT DEALS ── */}
      {hotFlights.length > 0 && (
        <section style={{ background: "var(--color-mist)", padding: "72px 0" }}>
          <div className="container-page">
            <div className="section-header">
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-ember)", marginBottom: 6 }}>Daddy&apos;s Choice</div>
                <h2 style={{ fontSize: "clamp(26px, 2.4vw, 34px)", fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", margin: 0 }}>Hot Deals</h2>
              </div>
              <a href="/search?hot=1" style={{ fontSize: 14.5, fontWeight: 700, color: "var(--color-blue)", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                Tümünü gör →
              </a>
            </div>
            <div className="flight-grid">
              {hotFlights.map((f, i) => <FlightCard key={f.id} f={f} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 0", background: "#fff" }} id="how">
        <div className="container-page">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-blue)", marginBottom: 10 }}>Nasıl Çalışır</div>
            <h2 style={{ fontSize: "clamp(26px, 2.4vw, 36px)", fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", margin: 0 }}>3 adımda özel jet deneyimi</h2>
          </div>
          <div className="steps-grid">
            {[
              ["01", "Uçuşu Bul", "Hot deals arasından veya rota arayarak istediğin uçuşu seç."],
              ["02", "Depozito Yatır", "Fiyatın sadece %10'unu depozito olarak öde, uçuşu kilitle."],
              ["03", "Uç ve Değerlendir", "Ekibimiz onaylar, full ödemeyi yap, hayatının uçuşunu yap."],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ background: "var(--color-sky-50)", borderRadius: 20, padding: "32px 28px", border: "1px solid var(--color-line)" }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: "var(--color-sky-200)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16 }}>{num}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.02em", marginBottom: 10 }}>{title}</div>
                <p style={{ fontSize: 14.5, color: "var(--color-muted)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL FLIGHTS ── */}
      <section style={{ background: "var(--color-mist)", padding: "72px 0" }}>
        <div className="container-page">
          <div className="section-header">
            <h2 style={{ fontSize: "clamp(22px, 2vw, 30px)", fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", margin: 0 }}>Yaklaşan Uçuşlar</h2>
            <a href="/search" style={{ fontSize: 14.5, fontWeight: 700, color: "var(--color-blue)", whiteSpace: "nowrap" }}>Tümünü gör →</a>
          </div>
          <div className="flight-grid">
            {allFlights.map((f, i) => <FlightCard key={f.id} f={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{ background: "#fff", padding: "72px 0" }}>
        <div className="container-page">
          <h2 style={{ textAlign: "center", fontSize: "clamp(22px, 2vw, 30px)", fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", marginBottom: 48 }}>
            Neden Daddy&apos;s Jet?
          </h2>
          <div className="trust-grid">
            {[
              ["✈", "SHGM Onaylı", "Tüm operatörlerimiz Sivil Havacılık Genel Müdürlüğü onaylı."],
              ["⚡", "Anında Kilitle", "Depozito öder ödemez uçuş başkasına kapanır."],
              ["💰", "Tam İade Garantisi", "Operatör reddi veya iptal talebinde paranı iade ederiz."],
              ["📞", "7/24 Destek", "Gerçek bir insan her zaman seninle — WhatsApp veya telefon."],
            ].map(([icon, title, desc]) => (
              <div key={title as string} style={{ textAlign: "center", padding: "24px 16px" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--color-navy)", marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</div>
                <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

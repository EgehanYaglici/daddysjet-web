import { prisma } from "@/lib/prisma";
import { FlightCard } from "@/components/flights/FlightCard";
import { SearchBarServer } from "@/components/ui/SearchBarServer";
import type { FlightWithOperator } from "@/lib/types";
import Image from "next/image";

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
    take: 6,
  });
  return JSON.parse(JSON.stringify(flights));
}

export default async function HomePage() {
  const [hotFlights, allFlights] = await Promise.all([getHotFlights(), getAllFlights()]);
  const hotCount = hotFlights.length;

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: 720, marginTop: -74, paddingTop: 74, overflow: "hidden" }}>
        <Image
          src="/images/landing_banner.png"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(5,15,34,.72) 0%, rgba(5,15,34,.45) 50%, rgba(5,15,34,.15) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,15,34,.3) 0%, transparent 30%, transparent 70%, rgba(5,15,34,.5) 100%)" }} />

        <div className="hero-inner" style={{ position: "relative" }}>
          {hotCount > 0 && (
            <div className="live-pill">
              <span className="pulse-dot" />
              Şu an {hotCount} hot deal · canlı fiyatlar
            </div>
          )}

          <h1 className="hero-title" style={{ marginTop: 20 }}>
            Boş dönen özel jetler,<br />
            <span style={{ color: "#E3BE72" }}>%80&apos;e varan indirimle.</span>
          </h1>

          <p className="hero-sub">
            Türkiye&apos;nin yetkili operatörlerinden empty leg uçuşları tek platformda. Anında gör, ön ödemeyle yerini ayır —{" "}
            <span style={{ color: "var(--color-gold)", fontWeight: 700, fontStyle: "italic" }}>daddy knows a better way.</span>
          </p>

          <SearchBarServer />

          <div className="hero-quick-routes">
            {["İstanbul → Bodrum", "İstanbul → Dubai", "Antalya → İstanbul", "İstanbul → Paris"].map((r) => (
              <a key={r} href="/search" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.22)", color: "#fff", fontSize: 13.5, fontWeight: 600, padding: "8px 15px", borderRadius: 999, backdropFilter: "blur(6px)", whiteSpace: "nowrap", textDecoration: "none" }}>
                {r}
              </a>
            ))}
          </div>

          <div className="hero-stats">
            {[["%42", "ortalama indirim"], ["90 sn", "rezervasyon süresi"], ["8+", "yetkili operatör"], ["4.9★", "müşteri puanı"]].map(([n, l]) => (
              <div key={l} style={{ whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 8, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOT DEALS ── */}
      {hotFlights.length > 0 && (
        <section style={{ background: "var(--color-mist)", padding: "76px 0" }}>
          <div className="container-page">
            <div className="section-header">
              <div>
                <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-gold)" }}>
                  🔥 Bugünün Fırsatları
                </div>
                <h2 style={{ fontSize: 38, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.03em", margin: "10px 0 0" }}>Daddy&apos;s Choice</h2>
                <p style={{ fontSize: 16, color: "var(--color-muted)", marginTop: 8 }}>Operatörlerimizin önerdiği en avantajlı empty leg uçuşları.</p>
              </div>
              <a href="/search?hot=1" className="btn-ghost">Tümünü gör →</a>
            </div>
            <div className="flight-grid">
              {hotFlights.map((f, i) => <FlightCard key={f.id} f={f} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS — dark navy with animated plane ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "94px 0 84px", background: "var(--color-navy)" }} id="how">
        {/* Radial gradient decorations */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(75% 60% at 88% -12%, rgba(184,142,61,.20), transparent 55%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 75% at -5% 120%, rgba(21,68,140,.40), transparent 55%)" }} />

        {/* Dashed background arc */}
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, top: 150, width: "100%", height: 280, opacity: 0.6, pointerEvents: "none" }}>
          <path d="M-20 240 C 320 70, 880 70, 1220 240" fill="none" stroke="rgba(184,142,61,.28)" strokeWidth="1.5" strokeDasharray="2 10" />
        </svg>

        <div className="container-page" style={{ position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 66px" }}>
            <div className="eyebrow" style={{ color: "var(--color-gold)" }}>Nasıl Çalışır</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: "-0.035em", margin: "14px 0 0" }}>Üç adımda gökyüzünde</h2>
            <p style={{ fontSize: 17, lineHeight: 1.62, color: "rgba(226,233,243,.74)", marginTop: 14 }}>Boş dönen bir uçuş bulun, ön ödemeyle yerinizi tutun — gerisini ekibimiz operatörle sizin için halletsin.</p>
          </div>

          {/* Stepper */}
          <div style={{ position: "relative" }}>
            {/* Animated flight path + SVG plane */}
            <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ position: "absolute", top: 14, left: 0, width: "100%", height: 40, zIndex: 0, pointerEvents: "none", overflow: "visible" }}>
              <line x1="100" y1="20" x2="1100" y2="20" stroke="rgba(203,219,237,.2)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
              <line x1="100" y1="20" x2="1100" y2="20" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="100">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="6s" repeatCount="indefinite" />
              </line>
              <g>
                <g fill="#E8CF95" transform="scale(0.8)">
                  <path d="M-21,-8.6 L-12.5,-8.6 L-12.5,-9.8 L-22,-9.8 Z" />
                  <path d="M-16,-2.2 L-20,-9.2 L-15.4,-9.2 L-11.3,-2.2 Z" />
                  <path d="M20,0 C17,-2.4 7,-2.9 -5,-2.7 L-16,-2.4 C-19,-2.2 -21,-1.4 -21,-0.6 C-21,0.7 -19,1.3 -16,1.5 L-5,2 C9,2.3 17,1.9 20,0 Z" />
                  <path d="M-9,-1.7 C-9,-3.3 -15.5,-3.3 -15.5,-1.7 C-15.5,-0.2 -9,-0.2 -9,-1.7 Z" />
                  <path d="M1,1.5 L-13,7.2 L-7,7.5 L4.5,2 Z" />
                </g>
                <path d="M13.6,-1.5 L17.8,-0.5 L13.6,0.3 Z" fill="var(--color-navy)" transform="scale(0.8)" />
                <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" path="M100,20 L1100,20" />
              </g>
            </svg>

            <div className="steps-grid">
              {[
                { n: "01", icon: "🔍", t: "Uçuşu seç", d: "Hot deals'e göz at ya da rotanı ara. Her uçuşun fiyatı, jeti ve operatör puanı tam şeffaf.", delay: "0ms" },
                { n: "02", icon: "🛡", t: "Rezervasyon yap", d: "Fiyatın %10'u ön ödemeyle yerini ayır. Kart, TL havale ya da USD Swift — sana uygun olan.", delay: "90ms" },
                { n: "03", icon: "📞", t: "Biz arayalım", d: "Ekibimiz operatörle konuşur, sorularını yanıtlar; onay sonrası tam ödeme linkini gönderir.", delay: "180ms" },
              ].map((s, i) => (
                <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ width: 68, height: 68, borderRadius: "50%", margin: "0 auto", background: "var(--color-sky-200)", border: "6px solid var(--color-navy)", boxShadow: "0 0 0 1px var(--color-gold)", display: "grid", placeItems: "center", position: "relative", zIndex: 2, fontSize: 28 }}>
                    <span className="node-ping" style={{ animationDelay: `${[0.7, 3.1, 5.5][i]}s` }} />
                    {s.icon}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, padding: "5px 14px", borderRadius: 999, background: "rgba(184,142,61,.14)", border: "1px solid rgba(184,142,61,.32)", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "var(--color-gold)" }}>ADIM {s.n}</span>
                  </div>
                  <h3 style={{ fontSize: 21, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: "15px 0 9px" }}>{s.t}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.62, color: "rgba(226,233,243,.66)", margin: "0 auto", maxWidth: 268 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 34, flexWrap: "wrap", marginTop: 66, paddingTop: 36, borderTop: "1px solid rgba(203,219,237,.16)" }}>
            {["Operatör onaylamazsa tam iade", "24 saat içinde ücretsiz iptal", "Yalnızca SHGM lisanslı operatörler"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "rgba(226,233,243,.84)" }}>
                <span style={{ color: "var(--color-gold)", display: "flex" }}>✓</span>{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMPTY LEG EXPLANATION ── */}
      <section style={{ padding: "90px 0", background: "#fff" }}>
        <div className="container-page" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Empty Leg Nedir?</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.03em", margin: "0 0 24px", lineHeight: 1.15 }}>
              Boş bacak uçuşu<br /><span style={{ color: "var(--color-gold)" }}>neden bu kadar ucuz?</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 16, lineHeight: 1.7, color: "var(--color-muted)" }}>
              <p style={{ margin: 0 }}>Bir müşteri İstanbul&apos;dan Bodrum&apos;a özel jet kiralıyor. Uçuş bittikten sonra jetin geri dönmesi gerekiyor — ama içi boş.</p>
              <p style={{ margin: 0 }}>İşte bu <strong style={{ color: "var(--color-navy)" }}>boş dönüş bacağına</strong> &quot;empty leg&quot; deniyor. Operatör bu uçuşu zaten yapacağı için, çok daha düşük fiyata yolcu kabul ediyor.</p>
              <p style={{ margin: 0 }}>Daddy&apos;s Jet olarak Türkiye&apos;nin yetkili operatörlerinden bu uçuşları toplayıp size sunuyoruz — <strong style={{ color: "var(--color-navy)" }}>özel jet deneyimini, herkesin ulaşabileceği fiyatlara getiriyoruz.</strong></p>
            </div>
          </div>
          <div>
            <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--color-line)", boxShadow: "0 8px 40px rgba(8,31,65,.1)" }}>
              <div style={{ height: 170, background: "linear-gradient(135deg, #050F22, #15448C)", position: "relative", display: "flex", alignItems: "flex-end", padding: "0 18px 16px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.8)", background: "rgba(0,0,0,.35)", padding: "4px 10px", borderRadius: 6, backdropFilter: "blur(4px)", position: "absolute", top: 14, left: 16 }}>Gerçek örnek</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Bodrum</span>
                  <span style={{ color: "var(--color-gold)" }}>✈</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>İstanbul</span>
                </div>
              </div>
              <div style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--color-sky-100)", color: "var(--color-muted)", display: "grid", placeItems: "center", fontSize: 17 }}>✈</span>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>Normal özel jet kirası</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-navy)" }}>$16,500</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--color-gold-soft)", color: "var(--color-gold)", display: "grid", placeItems: "center", fontSize: 17 }}>⚡</span>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>Daddy&apos;s Jet empty leg fiyatı</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-navy)" }}>$6,000 <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ok)" }}>/ tüm uçak</span></div>
                  </div>
                </div>
                <div style={{ borderTop: "2px dashed var(--color-line-strong)", paddingTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--color-ok-soft)", color: "var(--color-ok)", display: "grid", placeItems: "center", fontSize: 17 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 600 }}>Tasarrufunuz</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "var(--color-ok)" }}>$10,500</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-ok)", background: "var(--color-ok-soft)", padding: "2px 8px", borderRadius: 5 }}>%64 indirim</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--color-sky-50)", borderRadius: 10, display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ color: "var(--color-blue)" }}>👥</span>
                  <span style={{ fontSize: 13, color: "var(--color-navy)", fontWeight: 600 }}>7 kişiyle? Kişi başı sadece <strong>$857</strong> — business class&apos;tan ucuz.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR ROUTES ── */}
      <section style={{ padding: "76px 0", background: "var(--color-mist)" }}>
        <div className="container-page">
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px" }}>
            <div className="eyebrow" style={{ color: "var(--color-gold)" }}>Popüler Rotalar</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.03em", margin: "10px 0 0" }}>En çok aranan empty leg&apos;ler</h2>
            <p style={{ fontSize: 16, color: "var(--color-muted)", marginTop: 10 }}>Türkiye&apos;nin en popüler özel jet rotaları, şimdi empty leg fiyatlarıyla.</p>
          </div>
          <div className="routes-grid">
            {[
              { from: "İstanbul", to: "Bodrum", code: "LTFM → LTFE", price: "$6,000" },
              { from: "İstanbul", to: "Antalya", code: "LTFM → LTAI", price: "$5,200" },
              { from: "İstanbul", to: "Dubai", code: "LTFM → OMDB", price: "$18,500" },
              { from: "İstanbul", to: "Paris", code: "LTFM → LFPB", price: "$22,000" },
            ].map((r) => (
              <a key={r.code} href="/search" style={{ textDecoration: "none", borderRadius: 16, overflow: "hidden", border: "1px solid var(--color-line)", background: "#fff", boxShadow: "0 1px 3px rgba(8,31,65,.06)", display: "block", transition: "transform .2s, box-shadow .2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 32px rgba(8,31,65,.12)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 1px 3px rgba(8,31,65,.06)"; }}>
                <div style={{ height: 110, background: "linear-gradient(135deg, #0E2D4F, #15448C)", position: "relative", display: "flex", alignItems: "flex-end", padding: "0 12px 10px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{r.from} → {r.to}</div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "var(--color-muted-2)", fontWeight: 600, letterSpacing: ".03em", marginBottom: 4 }}>{r.code}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--color-navy)" }}>{r.price}</span>
                    <span style={{ fontSize: 11, color: "var(--color-muted)", fontWeight: 600 }}>başlayan</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL FLIGHTS ── */}
      {allFlights.length > 0 && (
        <section style={{ background: "#fff", padding: "76px 0" }}>
          <div className="container-page">
            <div className="section-header">
              <div>
                <div className="eyebrow">Tüm Uçuşlar</div>
                <h2 style={{ fontSize: 38, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.03em", margin: "10px 0 0" }}>Yaklaşan empty leg&apos;ler</h2>
              </div>
              <a href="/search" className="btn-ghost">Arama &amp; filtrele →</a>
            </div>
            <div className="flight-grid">
              {allFlights.map((f, i) => <FlightCard key={f.id} f={f} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST / WHY DADDY'S JET ── */}
      <section style={{ padding: "90px 0", background: "#fff" }}>
        <div className="container-page">
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 44 }}>
            <Image src="/logo_icon.svg" alt="" width={52} height={52} style={{ flexShrink: 0 }} />
            <div>
              <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.03em", margin: "0 0 6px", lineHeight: 1.15 }}>Neden Daddy&apos;s Jet</h2>
              <p style={{ fontSize: 15, color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>Türkiye&apos;nin ilk empty leg platformu. Güven, şeffaflık ve kalite bir arada — <span style={{ color: "var(--color-gold)", fontWeight: 600, fontStyle: "italic" }}>daddy knows a better way.</span></p>
            </div>
          </div>

          <div className="trust-grid" style={{ marginBottom: 44 }}>
            {[
              { icon: "🛡", t: "SHGM Lisanslı Operatörler", d: "Sivil Havacılık Genel Müdürlüğü onaylı, tam sigortalı operatörlerle çalışıyoruz." },
              { icon: "📊", t: "Şeffaf Fiyatlandırma", d: "Liste fiyatı, indirim oranı ve ön ödeme tutarı açıkça belirtilir. Sürpriz yok." },
              { icon: "📞", t: "Kişisel Uçuş Danışmanı", d: "Rezervasyon sonrası sizi arayan ekip — bagaj, yemek, her detay bizzat netleşir." },
              { icon: "🔒", t: "Tam İade Garantisi", d: "Operatör onaylamazsa paranız eksiksiz iade. 24 saat içinde ücretsiz iptal hakkı." },
            ].map((x) => (
              <div key={x.t} style={{ background: "var(--color-sky-50)", border: "1px solid var(--color-line)", borderRadius: 16, padding: "24px 20px" }}>
                <span style={{ width: 42, height: 42, borderRadius: 11, background: "var(--color-navy)", display: "grid", placeItems: "center", marginBottom: 14, fontSize: 20 }}>{x.icon}</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-navy)", marginBottom: 6 }}>{x.t}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--color-muted)", margin: 0 }}>{x.d}</p>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 40px", background: "var(--color-navy)", borderRadius: 16, boxShadow: "0 8px 28px rgba(8,31,65,.18)" }}>
            {[["8+", "Yetkili operatör"], ["240+", "Tamamlanan uçuş"], ["4.9★", "Müşteri puanı"], ["%100", "İade oranı"]].map(([n, l], i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: i < 3 ? undefined : 0 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(226,233,243,.55)", marginTop: 4, fontWeight: 600 }}>{l}</div>
                </div>
                {i < 3 && <div style={{ width: 1, height: 36, background: "rgba(255,255,255,.12)", marginLeft: 40 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

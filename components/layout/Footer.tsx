import Link from "next/link";

const COL = [
  ["Keşfet", [["Hot Deals", "/search?hot=1"], ["Tüm Rotalar", "/search"], ["İstanbul → Bodrum", "/search?from=İstanbul&to=Bodrum"], ["İstanbul → Dubai", "/search?from=İstanbul&to=Dubai"]]],
  ["Kurumsal", [["Hakkımızda", "/about"], ["Nasıl Çalışır", "/#how"], ["SSS", "/faq"], ["İletişim", "/contact"]]],
  ["Yasal", [["Kullanım Şartları", "/terms"], ["Gizlilik", "/privacy"], ["İade Politikası", "/refund"], ["KVKK", "/kvkk"]]],
] as const;

export function Footer() {
  return (
    <footer style={{ background: "var(--color-ink)", color: "#fff", paddingTop: 64, paddingBottom: 36 }}>
      <div className="container-page">
        <div className="footer-grid">
          {/* Brand col */}
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
              Daddy&apos;s Jet
            </span>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--color-gold)", marginTop: 12, opacity: 0.8 }}>
              Daddy knows a better way
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,.6)", marginTop: 10, maxWidth: 300 }}>
              Türkiye&apos;nin ilk empty leg jet platformu. Yetkili operatörlerden boş bacak uçuşları, gerçek zamanlı fiyatlarla.
            </p>
            <a
              href="https://wa.me/905XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, background: "#25D366", color: "#fff", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              WhatsApp ile Ulaş
            </a>
          </div>

          {/* Link cols */}
          {COL.map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>
                {title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,.1)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 26, flexWrap: "wrap", gap: 14 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            © 2026 Daddy&apos;s Jet · daddysjet.com · Tüm fiyatlar USD&apos;dir
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            iyzico ile güvenli ödeme
          </span>
        </div>
      </div>
    </footer>
  );
}

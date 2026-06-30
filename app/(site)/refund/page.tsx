export default function RefundPage() {
  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-line)", padding: "28px 0" }}>
        <div className="container-page">
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", margin: 0 }}>İade Politikası</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--color-muted)", fontWeight: 600 }}>Son güncelleme: Haziran 2026</p>
        </div>
      </div>
      <div className="container-page" style={{ paddingTop: 40, maxWidth: 760 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--color-line)", padding: "36px 40px", lineHeight: 1.8, color: "var(--color-navy)" }}>

          <div style={{ background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#065f46", marginBottom: 6 }}>✅ Tam İade Garantisi</div>
            <p style={{ fontSize: 14, color: "#065f46", opacity: 0.85, margin: 0, lineHeight: 1.65 }}>
              Aşağıdaki koşullarda ödediğiniz depozito dahil tüm tutarı iade ederiz — hiçbir kesinti yapmadan.
            </p>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Tam İade Alacağınız Durumlar</h2>
          <ul style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 28, paddingLeft: 20, lineHeight: 2 }}>
            <li><strong>Operatör reddi:</strong> Operatörün rezervasyonu onaylamaması halinde.</li>
            <li><strong>24 saat öncesi iptal:</strong> Kalkıştan en az 24 saat önce yazılı iptal talebi.</li>
            <li><strong>Mücbir sebep:</strong> Fırtına, hükümet yasağı, havalimanı kapanması vb. durumlar.</li>
            <li><strong>Operatör kaynaklı iptal:</strong> Uçuşun operatör tarafından iptal edilmesi.</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>İade Edilmeyebilecek Durumlar</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 28 }}>
            Kalkıştan 24 saatten az süre kala yapılan iptal taleplerinde depozito iade edilmeyebilir. Her durum Daddy&apos;s Jet ekibi tarafından ayrıca değerlendirilir.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>İade Süreci</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 0 }}>
            İade taleplerinde işlem 5-10 iş günü içinde gerçekleştirilir. Kredi kartı iadelerinde kartınıza yansıma süresi bankanıza göre değişebilir. TL havale ve USD Swift iadelerinde IBAN/SWIFT bilginizi concierge@daddysjet.com adresine iletmeniz gerekir.
          </p>
        </div>
      </div>
    </div>
  );
}

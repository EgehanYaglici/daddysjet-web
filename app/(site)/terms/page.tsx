export default function TermsPage() {
  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-line)", padding: "28px 0" }}>
        <div className="container-page">
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", margin: 0 }}>Kullanım Şartları</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--color-muted)", fontWeight: 600 }}>Son güncelleme: Haziran 2026</p>
        </div>
      </div>
      <div className="container-page" style={{ paddingTop: 40, maxWidth: 760 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--color-line)", padding: "36px 40px", lineHeight: 1.8, color: "var(--color-navy)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>1. Hizmetin Kapsamı</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Daddy&apos;s Jet (daddysjet.com), Türkiye&apos;deki yetkili hava taşıyıcılarından empty leg (boş bacak) uçuş fırsatlarını listeleyen ve rezervasyon hizmeti sunan bir aracı platformdur. Platform, uçuşları bizzat işletmemekte; yalnızca yetkili operatörler ile yolcular arasında aracılık sağlamaktadır.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>2. Rezervasyon ve Ödeme</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Bir uçuş rezervasyonu için toplam fiyatın %10&apos;u depozito olarak tahsil edilir. Depozito ödendiği anda ilgili uçuş başka kullanıcılara kapatılır (&quot;ilk gelen alır&quot; prensibi). Tam ödeme, ekibimizin operatörü onaylamasından sonra talep edilir. Kredi kartı ödemelerine %3,5 işlem ücreti uygulanır.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>3. İptal ve İade</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Aşağıdaki durumlarda tam iade yapılır: (a) operatörün uçuşu reddetmesi, (b) uçuşun kalkışından en az 24 saat önce yazılı iptal talebi, (c) mücbir sebep halleri (hava koşulları, hükümet kararı vb.). Bu koşullar dışındaki iptallerde depozito iade edilmeyebilir.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>4. Operatör Bilgisi</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Operatör kimliği, rezervasyon onaylanana kadar yolcuya açıklanmaz. Tüm operatörler Sivil Havacılık Genel Müdürlüğü (SHGM) tarafından lisanslandırılmış ve Daddy&apos;s Jet tarafından doğrulanmıştır.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>5. Sorumluluk Sınırı</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Daddy&apos;s Jet; uçuş iptali, rötar, hasar veya kayıp bagaj gibi hava taşıyıcısından kaynaklanan durumlardan sorumlu tutulamaz. Platform yalnızca rezervasyon aracılık hizmeti sunmaktadır.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>6. Değişiklikler</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 0 }}>
            Bu şartlar önceden bildirimde bulunulmaksızın güncellenebilir. Platformu kullanmaya devam etmeniz güncel şartları kabul ettiğiniz anlamına gelir. İletişim: concierge@daddysjet.com
          </p>
        </div>
      </div>
    </div>
  );
}

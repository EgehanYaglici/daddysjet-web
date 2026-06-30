export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-line)", padding: "28px 0" }}>
        <div className="container-page">
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", margin: 0 }}>Gizlilik Politikası</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--color-muted)", fontWeight: 600 }}>Son güncelleme: Haziran 2026</p>
        </div>
      </div>
      <div className="container-page" style={{ paddingTop: 40, maxWidth: 760 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--color-line)", padding: "36px 40px", lineHeight: 1.8, color: "var(--color-navy)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>1. Toplanan Veriler</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Ad, soyad, e-posta adresi ve telefon numarası gibi kimlik bilgileri; rezervasyon detayları (rota, tarih, ödeme tutarı); platform kullanımına ilişkin teknik veriler (IP adresi, tarayıcı bilgisi, çerezler).
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>2. Verilerin Kullanımı</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Verileriniz; rezervasyon ve ödeme işlemlerini yürütmek, operatörlerle koordinasyon sağlamak, yasal yükümlülükleri yerine getirmek, platform güvenliğini sağlamak ve hizmet kalitesini iyileştirmek amacıyla kullanılmaktadır.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>3. Üçüncü Taraflarla Paylaşım</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Kişisel verileriniz; yalnızca rezervasyonunuzu gerçekleştirecek hava taşıyıcısıyla (onay aşamasından sonra), ödeme altyapı sağlayıcılarıyla (iyzico) ve yasal yükümlülükler kapsamında yetkili kurumlarla paylaşılır. Pazarlama amacıyla üçüncü taraflara satılmaz.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>4. Veri Güvenliği</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Tüm veriler AWS altyapısında (RDS, S3, Cognito) TLS/SSL şifrelemesiyle depolanır. Ödeme bilgileri iyzico altyapısında tutulur; kart numaraları Daddy&apos;s Jet sunucularında saklanmaz.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>5. Haklarınız</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 0 }}>
            Kişisel verilerinize erişim, düzeltme veya silme taleplerinizi concierge@daddysjet.com adresine iletebilirsiniz. KVKK kapsamındaki haklarınız için lütfen KVKK sayfamızı inceleyin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function KVKKPage() {
  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 80 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-line)", padding: "28px 0" }}>
        <div className="container-page">
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--color-navy)", letterSpacing: "-0.025em", margin: 0 }}>KVKK Aydınlatma Metni</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--color-muted)", fontWeight: 600 }}>6698 sayılı Kişisel Verilerin Korunması Kanunu · Son güncelleme: Haziran 2026</p>
        </div>
      </div>
      <div className="container-page" style={{ paddingTop: 40, maxWidth: 760 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--color-line)", padding: "36px 40px", lineHeight: 1.8, color: "var(--color-navy)" }}>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>1. Veri Sorumlusu</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca veri sorumlusu sıfatını haiz Daddy&apos;s Jet tarafından düzenlenmiştir. İletişim: concierge@daddysjet.com
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>2. İşlenen Kişisel Veriler</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Ad-soyad, e-posta adresi, telefon numarası (kimlik/iletişim), uçuş rezervasyon bilgileri (işlem), IP adresi ve çerez verileri (teknik), ödeme tutarı — kart numarası hariç (finansal).
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24, paddingLeft: 20, lineHeight: 2 }}>
            <li>Sözleşmenin kurulması ve ifası (rezervasyon, ödeme, onay süreci)</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, havacılık mevzuatı)</li>
            <li>Meşru menfaatler (dolandırıcılık önleme, platform güvenliği)</li>
            <li>Açık rıza kapsamında: pazarlama iletişimi (isteğe bağlı)</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>4. Kişisel Verilerin Aktarımı</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24 }}>
            Verileriniz; onaylanan hava taşıyıcısına, ödeme hizmet sağlayıcısına (iyzico), bulut altyapı sağlayıcısına (AWS — yurt dışı aktarım) ve yetkili kamu kurumlarına aktarılabilir. Yurt dışına aktarım, Kurul onaylı standart sözleşmeler çerçevesinde gerçekleştirilir.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>5. KVKK&apos;dan Doğan Haklarınız</h2>
          <ul style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 24, paddingLeft: 20, lineHeight: 2 }}>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>Eksik veya yanlış verilerin düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini talep etme</li>
            <li>Aktarılan üçüncü kişilere bildirim yapılmasını isteme</li>
            <li>Zararın giderilmesini talep etme</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>6. Başvuru Yöntemi</h2>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", marginBottom: 0 }}>
            KVKK kapsamındaki taleplerinizi, kimliğinizi doğrulayan belgelerle birlikte concierge@daddysjet.com adresine e-posta yoluyla iletebilirsiniz. Talepler 30 gün içinde yanıtlanır.
          </p>
        </div>
      </div>
    </div>
  );
}

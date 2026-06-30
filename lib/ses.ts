import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.AWS_REGION ?? "eu-central-1" });
const FROM = process.env.SES_FROM_EMAIL ?? "noreply@daddysjet.com";

export async function sendBookingConfirmationEmail(opts: {
  to: string;
  name: string;
  pnr: string;
  flightRoute: string;
  departureDate: string;
  depositAmount: string;
}) {
  const { to, name, pnr, flightRoute, departureDate, depositAmount } = opts;

  await ses.send(
    new SendEmailCommand({
      Source: `Daddy's Jet <${FROM}>`,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: `Rezervasyonunuz alındı — PNR: ${pnr}`, Charset: "UTF-8" },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
<!DOCTYPE html>
<html lang="tr">
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f5f8fc; margin:0; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(8,31,65,.09);">
    <div style="background:#081F41; padding:32px 36px;">
      <p style="font-size:22px; font-weight:800; color:#fff; margin:0; letter-spacing:-0.02em;">Daddy's Jet</p>
      <p style="font-size:13px; color:rgba(255,255,255,.6); margin:6px 0 0; font-weight:600; letter-spacing:.06em; text-transform:uppercase;">Daddy knows a better way</p>
    </div>
    <div style="padding:36px;">
      <p style="font-size:20px; font-weight:800; color:#0d1f3c; margin:0 0 8px;">Merhaba, ${name.split(" ")[0]}!</p>
      <p style="font-size:15px; color:#5a6981; margin:0 0 28px; line-height:1.6;">Rezervasyonunuz alındı. Ekibimiz operatörle iletişime geçip sizi arayacak.</p>

      <div style="background:#f5f8fc; border-radius:12px; padding:20px 24px; margin-bottom:24px;">
        <p style="font-size:11px; font-weight:700; color:#8896ac; letter-spacing:.08em; text-transform:uppercase; margin:0 0 4px;">PNR Numaranız</p>
        <p style="font-size:28px; font-weight:800; color:#081F41; margin:0; letter-spacing:.08em;">${pnr}</p>
      </div>

      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:10px 0; border-bottom:1px solid #e3e9f1; font-size:13px; color:#8896ac; font-weight:600;">Rota</td><td style="padding:10px 0; border-bottom:1px solid #e3e9f1; font-size:14px; font-weight:700; color:#0d1f3c; text-align:right;">${flightRoute}</td></tr>
        <tr><td style="padding:10px 0; border-bottom:1px solid #e3e9f1; font-size:13px; color:#8896ac; font-weight:600;">Tarih</td><td style="padding:10px 0; border-bottom:1px solid #e3e9f1; font-size:14px; font-weight:700; color:#0d1f3c; text-align:right;">${departureDate}</td></tr>
        <tr><td style="padding:10px 0; font-size:13px; color:#8896ac; font-weight:600;">Ödenen depozito</td><td style="padding:10px 0; font-size:14px; font-weight:700; color:#0d1f3c; text-align:right;">${depositAmount}</td></tr>
      </table>

      <div style="margin-top:28px; padding:18px 20px; background:#e5f2eb; border-radius:10px;">
        <p style="font-size:13px; color:#1e8e63; font-weight:600; margin:0; line-height:1.6;">✓ Depozito ödemeniz güvende. İptal talebiniz halinde tam iade yapılır.</p>
      </div>

      <p style="font-size:13px; color:#8896ac; margin:28px 0 0; line-height:1.6;">Sorularınız için: <a href="mailto:destek@daddysjet.com" style="color:#15448c;">destek@daddysjet.com</a></p>
    </div>
  </div>
</body>
</html>`,
          },
        },
      },
    })
  );
}

export async function sendOperatorApprovalEmail(opts: {
  to: string;
  name: string;
  pnr: string;
  flightRoute: string;
  departureDate: string;
  paymentLink: string;
}) {
  const { to, name, pnr, flightRoute, departureDate, paymentLink } = opts;

  await ses.send(
    new SendEmailCommand({
      Source: `Daddy's Jet <${FROM}>`,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: `Uçuşunuz onaylandı — Ödeme linki: ${pnr}`, Charset: "UTF-8" },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
<!DOCTYPE html>
<html lang="tr">
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f5f8fc; margin:0; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(8,31,65,.09);">
    <div style="background:#1e8e63; padding:32px 36px;">
      <p style="font-size:22px; font-weight:800; color:#fff; margin:0; letter-spacing:-0.02em;">Daddy's Jet ✓</p>
      <p style="font-size:14px; color:rgba(255,255,255,.8); margin:8px 0 0; font-weight:600;">Operatör onayı alındı</p>
    </div>
    <div style="padding:36px;">
      <p style="font-size:20px; font-weight:800; color:#0d1f3c; margin:0 0 8px;">Harika haber, ${name.split(" ")[0]}!</p>
      <p style="font-size:15px; color:#5a6981; margin:0 0 28px; line-height:1.6;">Operatör uçuşunuzu onayladı. Tam ödemeyi tamamlayarak rezervasyonunuzu garantileyin.</p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:28px;">
        <tr><td style="padding:10px 0; border-bottom:1px solid #e3e9f1; font-size:13px; color:#8896ac; font-weight:600;">Rota</td><td style="padding:10px 0; border-bottom:1px solid #e3e9f1; font-size:14px; font-weight:700; color:#0d1f3c; text-align:right;">${flightRoute}</td></tr>
        <tr><td style="padding:10px 0; font-size:13px; color:#8896ac; font-weight:600;">Tarih</td><td style="padding:10px 0; font-size:14px; font-weight:700; color:#0d1f3c; text-align:right;">${departureDate}</td></tr>
      </table>

      <a href="${paymentLink}" style="display:block; text-align:center; background:#081F41; color:#fff; padding:16px 32px; border-radius:12px; font-weight:700; font-size:16px; text-decoration:none;">Ödemeyi Tamamla →</a>

      <p style="font-size:12px; color:#8896ac; margin:16px 0 0; text-align:center;">Bu link 24 saat geçerlidir.</p>
    </div>
  </div>
</body>
</html>`,
          },
        },
      },
    })
  );
}

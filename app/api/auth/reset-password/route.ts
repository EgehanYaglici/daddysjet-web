import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });
const CLIENT_ID = "418cal5naptt6t38go48b403d1";

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();

  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }

  try {
    await client.send(
      new ConfirmForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code.trim(),
        Password: newPassword,
      })
    );

    return NextResponse.json({ message: "password_reset" });
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    if (e.name === "CodeMismatchException") {
      return NextResponse.json({ error: "Kod hatalı." }, { status: 400 });
    }
    if (e.name === "ExpiredCodeException") {
      return NextResponse.json({ error: "Kodun süresi dolmuş." }, { status: 400 });
    }
    if (e.name === "InvalidPasswordException") {
      return NextResponse.json({ error: "Şifre: büyük harf, küçük harf ve rakam içermeli." }, { status: 400 });
    }
    return NextResponse.json({ error: e.message ?? "Şifre güncellenemedi." }, { status: 500 });
  }
}

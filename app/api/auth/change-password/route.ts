import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ChangePasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });

export async function POST(req: NextRequest) {
  const token = req.cookies.get("dj_access_token")?.value;
  if (!token) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }

  try {
    await client.send(
      new ChangePasswordCommand({
        AccessToken: token,
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword,
      })
    );
    return NextResponse.json({ message: "password_changed" });
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    if (e.name === "NotAuthorizedException") {
      return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 400 });
    }
    if (e.name === "InvalidPasswordException") {
      return NextResponse.json({ error: "Şifre: büyük harf, küçük harf ve rakam içermeli." }, { status: 400 });
    }
    return NextResponse.json({ error: e.message ?? "Şifre değiştirilemedi." }, { status: 500 });
  }
}

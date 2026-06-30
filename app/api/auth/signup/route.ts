import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });
const CLIENT_ID = "418cal5naptt6t38go48b403d1";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }

  try {
    await client.send(
      new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
        ],
      })
    );

    return NextResponse.json({ message: "verify_email" });
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    if (e.name === "UsernameExistsException") {
      return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
    }
    if (e.name === "InvalidPasswordException") {
      return NextResponse.json({ error: "Şifre: büyük harf, küçük harf ve rakam içermeli." }, { status: 400 });
    }
    return NextResponse.json({ error: e.message ?? "Kayıt sırasında hata oluştu." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });
const CLIENT_ID = "418cal5naptt6t38go48b403d1";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "E-posta ve kod gerekli." }, { status: 400 });
  }

  try {
    await client.send(
      new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code.trim(),
      })
    );

    return NextResponse.json({ message: "confirmed" });
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    if (e.name === "CodeMismatchException") {
      return NextResponse.json({ error: "Kod hatalı. Tekrar kontrol edin." }, { status: 400 });
    }
    if (e.name === "ExpiredCodeException") {
      return NextResponse.json({ error: "Kodun süresi dolmuş. Yeni kod isteyin." }, { status: 400 });
    }
    return NextResponse.json({ error: e.message ?? "Doğrulama hatası." }, { status: 500 });
  }
}

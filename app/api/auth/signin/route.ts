import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });
const CLIENT_ID = "418cal5naptt6t38go48b403d1";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli." }, { status: 400 });
  }

  try {
    const result = await client.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      })
    );

    const auth = result.AuthenticationResult;
    if (!auth?.AccessToken) {
      return NextResponse.json({ error: "Giriş başarısız." }, { status: 401 });
    }

    const res = NextResponse.json({ message: "ok" });

    res.cookies.set("dj_access_token", auth.AccessToken, {
      ...COOKIE_OPTS,
      maxAge: auth.ExpiresIn ?? 3600,
    });

    if (auth.RefreshToken) {
      res.cookies.set("dj_refresh_token", auth.RefreshToken, {
        ...COOKIE_OPTS,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return res;
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    if (e.name === "NotAuthorizedException") {
      return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
    }
    if (e.name === "UserNotConfirmedException") {
      return NextResponse.json({ error: "verify_email" }, { status: 403 });
    }
    if (e.name === "UserNotFoundException") {
      return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
    }
    return NextResponse.json({ error: e.message ?? "Giriş hatası." }, { status: 500 });
  }
}

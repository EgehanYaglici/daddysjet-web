import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = "418cal5naptt6t38go48b403d1";
const TOKEN_ENDPOINT = "https://daddysjet.auth.eu-central-1.amazoncognito.com/oauth2/token";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const returnTo = searchParams.get("state") ?? "/profile";

  if (error || !code) {
    return NextResponse.redirect(new URL(`/auth?error=oauth_failed`, req.url));
  }

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback`;

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL(`/auth?error=token_exchange`, req.url));
    }

    const tokens = await tokenRes.json();
    const res = NextResponse.redirect(new URL(returnTo, req.url));

    res.cookies.set("dj_access_token", tokens.access_token, {
      ...COOKIE_OPTS,
      maxAge: tokens.expires_in ?? 3600,
    });

    if (tokens.refresh_token) {
      res.cookies.set("dj_refresh_token", tokens.refresh_token, {
        ...COOKIE_OPTS,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return res;
  } catch {
    return NextResponse.redirect(new URL(`/auth?error=callback_error`, req.url));
  }
}

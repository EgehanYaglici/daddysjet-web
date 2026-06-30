import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  RevokeTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });
const CLIENT_ID = "418cal5naptt6t38go48b403d1";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("dj_refresh_token")?.value;

  if (refreshToken) {
    try {
      await client.send(new RevokeTokenCommand({ ClientId: CLIENT_ID, Token: refreshToken }));
    } catch {
      // silently ignore revoke errors
    }
  }

  const res = NextResponse.json({ message: "signed_out" });
  res.cookies.set("dj_access_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("dj_refresh_token", "", { maxAge: 0, path: "/" });
  return res;
}

import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "eu-central-1" });
const CLIENT_ID = "418cal5naptt6t38go48b403d1";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
  }

  try {
    await client.send(new ForgotPasswordCommand({ ClientId: CLIENT_ID, Username: email }));
    // Always return success to prevent email enumeration
    return NextResponse.json({ message: "code_sent" });
  } catch (err: unknown) {
    const e = err as { name?: string };
    if (e.name === "UserNotFoundException" || e.name === "InvalidParameterException") {
      return NextResponse.json({ message: "code_sent" });
    }
    return NextResponse.json({ message: "code_sent" });
  }
}

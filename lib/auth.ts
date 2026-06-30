import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { prisma } from "./prisma";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? "eu-central-1",
});

export async function getUserFromToken(accessToken: string) {
  try {
    const cmd = new GetUserCommand({ AccessToken: accessToken });
    const result = await cognitoClient.send(cmd);

    const sub = result.UserAttributes?.find((a) => a.Name === "sub")?.Value;
    const email = result.UserAttributes?.find((a) => a.Name === "email")?.Value;
    const name = result.UserAttributes?.find((a) => a.Name === "name")?.Value;

    if (!sub || !email) return null;

    // Upsert user in DB
    const user = await prisma.user.upsert({
      where: { cognitoId: sub },
      update: { email, name: name ?? undefined },
      create: { cognitoId: sub, email, name: name ?? undefined },
    });

    return user;
  } catch {
    return null;
  }
}

export function getAuthHeader(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

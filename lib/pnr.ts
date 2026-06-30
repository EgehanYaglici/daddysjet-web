import { prisma } from "./prisma";

const CHARS = "ABCDEFGHJKLMNPRSTUVYZ23456789";

function randomPNR(): string {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return "DJ" + s;
}

export async function generateUniquePNR(): Promise<string> {
  // Collision probability negligible but we double-check anyway
  for (let attempt = 0; attempt < 10; attempt++) {
    const pnr = randomPNR();
    const existing = await prisma.booking.findUnique({ where: { pnr } });
    if (!existing) return pnr;
  }
  throw new Error("PNR generation failed after 10 attempts");
}

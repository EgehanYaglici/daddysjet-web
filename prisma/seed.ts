import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type JetCategory = "LIGHT_JET" | "MIDSIZE_JET" | "SUPER_MIDSIZE" | "HEAVY_JET";
type FlightStatus = "AVAILABLE" | "RESERVED" | "CONFIRMED" | "SOLD" | "EXPIRED" | "CANCELLED";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Operators
  const opA = await prisma.operator.upsert({
    where: { code: "OP-A" },
    update: {},
    create: { code: "OP-A", name: "Anadolu Jet Chars", rating: 4.9, reviewCount: 128, flightCount: 240, trusted: true },
  });
  const opB = await prisma.operator.upsert({
    where: { code: "OP-B" },
    update: {},
    create: { code: "OP-B", name: "Blue Sky Aviation", rating: 4.7, reviewCount: 64, flightCount: 90, trusted: false },
  });
  const opC = await prisma.operator.upsert({
    where: { code: "OP-C" },
    update: {},
    create: { code: "OP-C", name: "Global Air Charter", rating: 4.8, reviewCount: 96, flightCount: 180, trusted: true },
  });
  const opD = await prisma.operator.upsert({
    where: { code: "OP-D" },
    update: {},
    create: { code: "OP-D", name: "Elite Wings", rating: 5.0, reviewCount: 47, flightCount: 60, trusted: true },
  });

  const flights = [
    {
      externalId: "DJ-4501",
      operatorId: opA.id,
      fromCity: "İstanbul", fromCode: "LTFM", fromAirport: "İstanbul Havalimanı",
      toCity: "Bodrum", toCode: "LTFE", toAirport: "Milas-Bodrum",
      departureAt: new Date("2026-08-12T14:30:00"),
      durationHrs: 1.2, aircraft: "Cessna Citation XLS+", category: "MIDSIZE_JET" as JetCategory,
      capacity: 8, baggage: "Orta (8 valiz)", priceUSD: 9800, listUSD: 16500,
      petFriendly: true, isHotDeal: true, scene: "bodrum",
      tags: ["Wi-Fi", "Deri koltuk", "İkram dahil"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-12T14:30:00"),
    },
    {
      externalId: "DJ-4502",
      operatorId: opC.id,
      fromCity: "İstanbul", fromCode: "LTFM", fromAirport: "İstanbul Havalimanı",
      toCity: "Dubai", toCode: "OMDB", toAirport: "Dubai Intl.",
      departureAt: new Date("2026-08-13T09:00:00"),
      durationHrs: 4.1, aircraft: "Bombardier Challenger 350", category: "SUPER_MIDSIZE" as JetCategory,
      capacity: 9, baggage: "Geniş (12 valiz)", priceUSD: 28500, listUSD: 47000,
      petFriendly: null, isHotDeal: true, scene: "dubai",
      tags: ["Wi-Fi", "Yatar koltuk", "Şef menüsü"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-13T09:00:00"),
    },
    {
      externalId: "DJ-4503",
      operatorId: opB.id,
      fromCity: "Bodrum", fromCode: "LTFE", fromAirport: "Milas-Bodrum",
      toCity: "İstanbul", toCode: "LTFM", toAirport: "İstanbul Havalimanı",
      departureAt: new Date("2026-08-14T18:45:00"),
      durationHrs: 1.2, aircraft: "Embraer Phenom 300", category: "LIGHT_JET" as JetCategory,
      capacity: 7, baggage: "Orta (6 valiz)", priceUSD: 8200, listUSD: 13900,
      petFriendly: true, isHotDeal: false, scene: "istanbul",
      tags: ["Wi-Fi", "Sessiz kabin"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-14T18:45:00"),
    },
    {
      externalId: "DJ-4504",
      operatorId: opA.id,
      fromCity: "İstanbul", fromCode: "LTBA", fromAirport: "Atatürk",
      toCity: "Antalya", toCode: "LTAI", toAirport: "Antalya",
      departureAt: new Date("2026-08-15T11:15:00"),
      durationHrs: 1.0, aircraft: "Cessna Citation CJ3", category: "LIGHT_JET" as JetCategory,
      capacity: 6, baggage: "Orta (5 valiz)", priceUSD: 7400, listUSD: 12200,
      petFriendly: false, isHotDeal: true, scene: "antalya",
      tags: ["Hızlı kalkış", "İkram dahil"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-15T11:15:00"),
    },
    {
      externalId: "DJ-4505",
      operatorId: opD.id,
      fromCity: "İstanbul", fromCode: "LTFM", fromAirport: "İstanbul Havalimanı",
      toCity: "Paris", toCode: "LFPB", toAirport: "Le Bourget",
      departureAt: new Date("2026-08-16T08:30:00"),
      durationHrs: 3.6, aircraft: "Dassault Falcon 2000", category: "HEAVY_JET" as JetCategory,
      capacity: 10, baggage: "Geniş (14 valiz)", priceUSD: 31200, listUSD: 52000,
      petFriendly: true, isHotDeal: false, scene: "paris",
      tags: ["Wi-Fi", "Yatak modu", "Şef menüsü", "Stüart"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-16T08:30:00"),
    },
    {
      externalId: "DJ-4506",
      operatorId: opC.id,
      fromCity: "İstanbul", fromCode: "LTFM", fromAirport: "İstanbul Havalimanı",
      toCity: "Londra", toCode: "EGGW", toAirport: "Luton",
      departureAt: new Date("2026-08-17T15:00:00"),
      durationHrs: 4.0, aircraft: "Gulfstream G450", category: "HEAVY_JET" as JetCategory,
      capacity: 13, baggage: "Geniş (16 valiz)", priceUSD: 36800, listUSD: 61000,
      petFriendly: null, isHotDeal: false, scene: "london",
      tags: ["Wi-Fi", "Yatak modu", "Toplantı masası"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-17T15:00:00"),
    },
    {
      externalId: "DJ-4507",
      operatorId: opB.id,
      fromCity: "Dalaman", fromCode: "LTBS", fromAirport: "Dalaman",
      toCity: "İstanbul", toCode: "LTFM", toAirport: "İstanbul Havalimanı",
      departureAt: new Date("2026-08-18T19:20:00"),
      durationHrs: 1.3, aircraft: "Hawker 900XP", category: "MIDSIZE_JET" as JetCategory,
      capacity: 8, baggage: "Orta (8 valiz)", priceUSD: 8900, listUSD: 15200,
      petFriendly: true, isHotDeal: true, scene: "istanbul",
      tags: ["Wi-Fi", "İkram dahil"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-18T19:20:00"),
    },
    {
      externalId: "DJ-4508",
      operatorId: opD.id,
      fromCity: "İstanbul", fromCode: "LTFM", fromAirport: "İstanbul Havalimanı",
      toCity: "Cenevre", toCode: "LSGG", toAirport: "Genève",
      departureAt: new Date("2026-08-19T10:45:00"),
      durationHrs: 3.3, aircraft: "Embraer Legacy 600", category: "HEAVY_JET" as JetCategory,
      capacity: 12, baggage: "Geniş (13 valiz)", priceUSD: 27600, listUSD: 44800,
      petFriendly: true, isHotDeal: false, scene: "geneva",
      tags: ["Wi-Fi", "Yatar koltuk", "Şef menüsü"], photoKeys: [],
      status: "AVAILABLE" as FlightStatus, expiresAt: new Date("2026-08-19T10:45:00"),
    },
  ];

  for (const f of flights) {
    await prisma.flight.upsert({
      where: { externalId: f.externalId },
      update: {},
      create: f,
    });
  }

  // Default exchange rate
  await prisma.exchangeRate.create({
    data: { usdToTry: 32.5, margin: 0.025, setByAdmin: "seed" },
  });

  console.log("✓ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

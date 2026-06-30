import { prisma } from "@/lib/prisma";
import { FlightCard } from "@/components/flights/FlightCard";
import type { FlightWithOperator } from "@/lib/types";
import type { Prisma } from "@prisma/client";

interface SearchParams {
  from?: string;
  to?: string;
  hot?: string;
  maxPrice?: string;
  category?: string;
  pet?: string;
}

export const dynamic = "force-dynamic";

async function searchFlights(p: SearchParams): Promise<FlightWithOperator[]> {
  const where: Prisma.FlightWhereInput = {
    status: "AVAILABLE",
    departureAt: { gte: new Date() },
    ...(p.from ? { fromCity: { contains: p.from, mode: "insensitive" } } : {}),
    ...(p.to   ? { toCity:   { contains: p.to,   mode: "insensitive" } } : {}),
    ...(p.hot === "1" ? { isHotDeal: true } : {}),
    ...(p.maxPrice ? { priceUSD: { lte: parseInt(p.maxPrice) } } : {}),
    ...(p.category ? { category: p.category as Prisma.EnumJetCategoryFilter } : {}),
    ...(p.pet === "1" ? { petFriendly: true } : {}),
  };

  const flights = await prisma.flight.findMany({
    where,
    include: {
      operator: { select: { code: true, rating: true, reviewCount: true, trusted: true, flightCount: true } },
    },
    orderBy: [{ isHotDeal: "desc" }, { departureAt: "asc" }],
    take: 50,
  });
  return JSON.parse(JSON.stringify(flights));
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const flights = await searchFlights(params);
  const hasQuery = !!(params.from || params.to);

  return (
    <div style={{ background: "var(--color-mist)", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Header bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-line)", padding: "20px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-navy)", margin: 0, letterSpacing: "-0.02em" }}>
            {hasQuery
              ? `${params.from || "Tüm Kalkışlar"} → ${params.to || "Tüm Varışlar"}`
              : params.hot === "1"
              ? "Hot Deals"
              : "Tüm Uçuşlar"}
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-muted)", margin: "4px 0 0", fontWeight: 500 }}>
            {flights.length} uçuş bulundu
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 32px 0" }}>
        <div style={{ display: "flex", gap: 28 }}>
          {/* Sidebar filters */}
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              background: "#fff",
              borderRadius: 16,
              border: "1px solid var(--color-line)",
              padding: "22px",
              height: "fit-content",
              position: "sticky",
              top: 90,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--color-navy)", marginBottom: 18, letterSpacing: "-0.01em" }}>
              Filtrele
            </div>

            {/* Max price */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-2)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>
                Maks. Fiyat
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["10000", "$10K altı"], ["20000", "$20K altı"], ["40000", "$40K altı"]].map(([val, label]) => (
                  <a
                    key={val}
                    href={`/search?${new URLSearchParams({ ...params, maxPrice: val }).toString()}`}
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: params.maxPrice === val ? "var(--color-blue)" : "var(--color-muted)",
                      display: "block",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-muted-2)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>
                Jet Sınıfı
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["LIGHT_JET", "Light Jet"], ["MIDSIZE_JET", "Midsize Jet"], ["SUPER_MIDSIZE", "Super Midsize"], ["HEAVY_JET", "Heavy Jet"]].map(([val, label]) => (
                  <a
                    key={val}
                    href={`/search?${new URLSearchParams({ ...params, category: val }).toString()}`}
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: params.category === val ? "var(--color-blue)" : "var(--color-muted)",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Pet */}
            <a
              href={`/search?${new URLSearchParams({ ...params, pet: params.pet === "1" ? "" : "1" }).toString()}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13.5,
                fontWeight: 600,
                color: params.pet === "1" ? "var(--color-blue)" : "var(--color-muted)",
              }}
            >
              <span style={{ fontSize: 16 }}>🐾</span> Evcil hayvan dostu
            </a>

            {/* Clear */}
            <a
              href="/search"
              style={{ display: "block", marginTop: 22, fontSize: 13, color: "var(--color-muted-2)", fontWeight: 600 }}
            >
              Filtreleri temizle
            </a>
          </aside>

          {/* Results */}
          <div style={{ flex: 1 }}>
            {flights.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✈</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-navy)", marginBottom: 8 }}>
                  Uçuş bulunamadı
                </div>
                <p style={{ fontSize: 15, color: "var(--color-muted)" }}>
                  Farklı tarih veya rota deneyin
                </p>
                <a
                  href="/search"
                  style={{
                    display: "inline-block",
                    marginTop: 20,
                    background: "var(--color-navy)",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Tüm uçuşları gör
                </a>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {flights.map((f, i) => (
                  <FlightCard key={f.id} f={f} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

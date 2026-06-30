"use client";

import { useState } from "react";
import Link from "next/link";
import type { FlightWithOperator } from "@/lib/types";

function formatUSD(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}
function discountPct(f: FlightWithOperator) {
  return Math.round((1 - f.priceUSD / f.listUSD) * 100);
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", weekday: "short" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export function FlightCard({ f, index = 0 }: { f: FlightWithOperator; index?: number }) {
  const [hover, setHover] = useState(false);
  const disc = discountPct(f);

  return (
    <div style={{ animationDelay: `${index * 60}ms` }}>
      <Link
        href={`/flights/${f.id}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "block",
          background: "#fff",
          border: "1px solid var(--color-line)",
          borderRadius: 20,
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform .22s cubic-bezier(.2,.7,.2,1), box-shadow .22s",
          transform: hover ? "translateY(-5px)" : "none",
          boxShadow: hover
            ? "0 24px 60px rgba(5,15,34,.16), 0 8px 24px rgba(5,15,34,.09)"
            : "0 1px 2px rgba(8,31,65,.06), 0 1px 3px rgba(8,31,65,.05)",
          textDecoration: "none",
        }}
      >
        {/* Image area — scene placeholder */}
        <div
          style={{
            height: 178,
            background: "linear-gradient(135deg, #0E2D4F, #15448c)",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 13,
              left: 13,
              right: 13,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              {f.isHotDeal && (
                <span
                  style={{
                    background: "var(--color-ember)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Hot Deal
                </span>
              )}
              {f.operator.trusted && (
                <span
                  style={{
                    background: "rgba(255,255,255,.16)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  Onaylı
                </span>
              )}
            </div>
            <span
              style={{
                background: "rgba(255,255,255,.16)",
                color: "#fff",
                borderRadius: 999,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700,
                backdropFilter: "blur(6px)",
              }}
            >
              −%{disc}
            </span>
          </div>

          {/* Route overlay */}
          <div
            style={{
              padding: "14px 16px",
              width: "100%",
              background: "linear-gradient(0deg, rgba(8,22,39,.7), transparent)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                {f.fromCode}
              </span>
              <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.3)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>✈</span>
              <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,.3)" }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                {f.toCode}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "15px 17px 17px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{ fontSize: 14.5, fontWeight: 700, color: "var(--color-navy)", letterSpacing: "-0.01em" }}
            >
              {f.aircraft}
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: "var(--color-blue)",
                background: "var(--color-sky-100)",
                padding: "3px 9px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {f.category.replace("_", " ")}
            </div>
          </div>

          <div style={{ fontSize: 13, color: "var(--color-muted)", fontWeight: 600, marginBottom: 12 }}>
            {fmtDate(f.departureAt)} · {fmtTime(f.departureAt)} &nbsp;·&nbsp; {f.durationHrs}sa &nbsp;·&nbsp; {f.capacity} kişi
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--color-line)", margin: "12px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-muted-2)",
                  textDecoration: "line-through",
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatUSD(f.listUSD)}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "var(--color-navy)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatUSD(f.priceUSD)}
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: hover ? "var(--color-blue)" : "var(--color-sky-100)",
                color: hover ? "#fff" : "var(--color-blue)",
                borderRadius: 10,
                padding: "9px 16px",
                fontSize: 13.5,
                fontWeight: 700,
                transition: "background .2s, color .2s",
              }}
            >
              İncele →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

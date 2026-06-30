"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function SearchBarServer() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const cities = ["İstanbul", "Bodrum", "Antalya", "Dalaman", "Dubai", "Paris", "Londra", "Cenevre"];

  function handleSearch() {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(5,15,34,.28), 0 8px 24px rgba(5,15,34,.12)",
        border: "1px solid rgba(255,255,255,.08)",
        maxWidth: 700,
        overflow: "hidden",
      }}
    >
      <datalist id="cities-list">
        {cities.map((c) => <option key={c} value={c} />)}
      </datalist>

      {/* From */}
      <div style={{ flex: 1, padding: "16px 22px", borderRight: "1px solid var(--color-line)" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--color-muted-2)", marginBottom: 4 }}>
          Nereden
        </div>
        <input
          list="cities-list"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Kalkış şehri"
          style={{
            border: "none",
            outline: "none",
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--color-navy)",
            width: "100%",
            background: "transparent",
            padding: 0,
          }}
        />
      </div>

      {/* To */}
      <div style={{ flex: 1, padding: "16px 22px", borderRight: "1px solid var(--color-line)" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--color-muted-2)", marginBottom: 4 }}>
          Nereye
        </div>
        <input
          list="cities-list"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Varış şehri"
          style={{
            border: "none",
            outline: "none",
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--color-navy)",
            width: "100%",
            background: "transparent",
            padding: 0,
          }}
        />
      </div>

      {/* Search btn */}
      <div style={{ display: "grid", placeItems: "center", padding: "0 18px" }}>
        <button
          onClick={handleSearch}
          disabled={isPending}
          style={{
            background: "var(--color-navy)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "13px 26px",
            fontSize: 14.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(8,31,65,.18)",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          Ara
        </button>
      </div>
    </div>
  );
}

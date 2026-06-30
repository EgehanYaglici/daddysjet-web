"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const light = isHome && !scrolled && !menuOpen;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "background .3s, box-shadow .3s, border-color .3s",
        background: light ? "transparent" : "rgba(255,255,255,.88)",
        backdropFilter: light ? "none" : "saturate(180%) blur(14px)",
        WebkitBackdropFilter: light ? "none" : "saturate(180%) blur(14px)",
        borderBottom: light ? "1px solid transparent" : "1px solid var(--color-line)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 74,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: light ? "#fff" : "var(--color-navy)",
              letterSpacing: "-0.03em",
            }}
          >
            Daddy&apos;s Jet
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            ["Hot Deals", "/search?hot=1"],
            ["Rotalar", "/search"],
            ["Nasıl Çalışır", "/#how"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: 14.5,
                fontWeight: 600,
                color: light ? "rgba(255,255,255,.9)" : "var(--color-navy)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/portal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: light ? "rgba(255,255,255,.16)" : "var(--color-navy)",
              color: "#fff",
              border: light ? "1px solid rgba(255,255,255,.3)" : "none",
              backdropFilter: light ? "blur(6px)" : "none",
              borderRadius: 10,
              padding: "9px 18px",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Hesabım
          </Link>
        </div>
      </div>
    </header>
  );
}

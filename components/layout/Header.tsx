"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  ["Hot Deals", "/search?hot=1"],
  ["Rotalar", "/search"],
  ["Nasıl Çalışır", "/#how"],
] as const;

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

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const light = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "background .3s, box-shadow .3s, border-color .3s",
          background: light ? "transparent" : "rgba(255,255,255,.92)",
          backdropFilter: light ? "none" : "saturate(180%) blur(14px)",
          WebkitBackdropFilter: light ? "none" : "saturate(180%) blur(14px)",
          borderBottom: light ? "1px solid transparent" : "1px solid var(--color-line)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 74,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
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

          {/* Desktop nav */}
          <nav className="header-nav-desktop">
            {NAV.map(([label, href]) => (
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

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              }}
            >
              <span className="header-actions-text">Rezervasyonum</span>
              <span style={{ fontSize: 16 }}>→</span>
            </Link>

            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menü"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "none", // overridden by CSS class on mobile
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: light ? "#fff" : "var(--color-navy)",
                  transition: "transform .2s, opacity .2s",
                  transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: light ? "#fff" : "var(--color-navy)",
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity .2s",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: light ? "#fff" : "var(--color-navy)",
                  transition: "transform .2s, opacity .2s",
                  transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            style={{
              display: "block",
              padding: "13px 8px",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--color-navy)",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/portal"
          style={{
            display: "block",
            marginTop: 16,
            background: "var(--color-navy)",
            color: "#fff",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 16,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Rezervasyonum
        </Link>
        <a
          href="https://wa.me/905XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginTop: 10,
            background: "#25D366",
            color: "#fff",
            borderRadius: 12,
            padding: "13px 20px",
            fontSize: 15,
            fontWeight: 700,
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          WhatsApp ile Ulaş
        </a>
      </div>
    </>
  );
}

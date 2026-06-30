"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const COGNITO_DOMAIN = "https://daddysjet.auth.eu-central-1.amazoncognito.com";
const CLIENT_ID = "418cal5naptt6t38go48b403d1";

type Screen =
  | "signin"
  | "signup"
  | "verify_email"
  | "forgot"
  | "reset_password"
  | "reset_done";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PlaneStars({ count }: { count: number }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = 5 + ((i * 37) % 90);
        const y = 5 + ((i * 53) % 85);
        const size = 1 + (i % 3);
        const opacity = 0.3 + (i % 5) * 0.1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#fff",
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return") ?? "/profile";

  const [screen, setScreen] = useState<Screen>("signin");
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [policyOpen, setPolicyOpen] = useState<{ url: string; title: string } | null>(null);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);

  const [planeBobAngle, setPlaneBobAngle] = useState(0);
  const [wingFlap, setWingFlap] = useState(false);
  const [excited, setExcited] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const bobT = useRef(0);

  useEffect(() => {
    const run = () => {
      bobT.current += 0.02;
      setPlaneBobAngle(Math.sin(bobT.current) * 4);
      animFrameRef.current = requestAnimationFrame(run);
    };
    animFrameRef.current = requestAnimationFrame(run);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  useEffect(() => {
    if (password.length > 0 && screen === "signup") {
      setWingFlap(true);
      const t = setTimeout(() => setWingFlap(false), 300);
      return () => clearTimeout(t);
    }
  }, [password, screen]);

  function handleTabSwitch(t: "signin" | "signup") {
    setTab(t);
    setScreen(t);
    setError("");
  }

  function handleGoogleLogin() {
    const origin = window.location.origin;
    const redirectUri = `${origin}/api/auth/callback`;
    const state = encodeURIComponent(returnTo);
    const url =
      `${COGNITO_DOMAIN}/oauth2/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&scope=openid+email+profile` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&identity_provider=Google` +
      `&state=${state}`;
    window.location.href = url;
  }

  async function handleSignIn() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "verify_email") {
          setScreen("verify_email");
        } else {
          setError(data.error ?? "Giriş yapılamadı.");
        }
        return;
      }
      setExcited(true);
      setTimeout(() => router.push(returnTo), 800);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setError("");
    if (!policiesAccepted) {
      setError("Devam etmek için politikaları kabul etmelisiniz.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Kayıt sırasında hata oluştu.");
        return;
      }
      setScreen("verify_email");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Doğrulama hatası.");
        return;
      }
      // Auto sign in after confirm
      const signInRes = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (signInRes.ok) {
        setExcited(true);
        setTimeout(() => router.push(returnTo), 800);
      } else {
        setTab("signin");
        setScreen("signin");
        setError("E-postanız doğrulandı. Şimdi giriş yapın.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setLoading(true);
    try {
      await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setError("Yeni kod gönderildi. E-postanızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit() {
    setError("");
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setEmail(forgotEmail);
      setScreen("reset_password");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: resetCode, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Şifre güncellenemedi.");
        return;
      }
      setScreen("reset_done");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14.5,
    fontWeight: 600,
    border: "1.5px solid rgba(255,255,255,.15)",
    borderRadius: 10,
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color .2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,.6)",
    letterSpacing: ".05em",
    textTransform: "uppercase",
    marginBottom: 7,
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    padding: "13px",
    fontSize: 15,
    fontWeight: 800,
    background: "linear-gradient(135deg, #1A6FD4, #0f4d9e)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    fontFamily: "inherit",
    transition: "opacity .15s",
    boxShadow: "0 4px 20px rgba(26,111,212,.35)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #050e1f 0%, #081830 40%, #0d2545 70%, #0a1e3d 100%)",
    }}>
      {/* Background stars */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <PlaneStars count={80} />
      </div>

      {/* Glow orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 600, height: 600, top: "-15%", right: "-10%", borderRadius: "50%", background: "radial-gradient(circle, rgba(26,111,212,.18) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "-10%", left: "-5%", borderRadius: "50%", background: "radial-gradient(circle, rgba(184,142,61,.08) 0%, transparent 60%)" }} />
      </div>

      {/* Card */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 820,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderRadius: 28,
        background: "rgba(255,255,255,.04)",
        backdropFilter: "blur(40px) saturate(1.4)",
        WebkitBackdropFilter: "blur(40px) saturate(1.4)",
        border: "1px solid rgba(255,255,255,.1)",
        boxShadow: "0 32px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08)",
        overflow: "hidden",
      }} className="auth-card">
        {/* Left panel */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 36px",
          textAlign: "center",
          background: "rgba(255,255,255,.02)",
          borderRight: "1px solid rgba(255,255,255,.06)",
        }} className="auth-brand">
          {/* Animated plane */}
          <div style={{
            width: 120,
            height: 120,
            marginBottom: 28,
            position: "relative",
            transform: `rotate(${planeBobAngle}deg)`,
            transition: excited ? "transform .1s" : "transform .8s ease-in-out",
            filter: excited ? "drop-shadow(0 0 20px rgba(26,111,212,.8))" : "drop-shadow(0 8px 32px rgba(26,111,212,.3))",
          }}>
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
              {/* Fuselage */}
              <ellipse cx="60" cy="60" rx="46" ry="16" fill="#1A6FD4" opacity="0.9" transform="rotate(-10 60 60)" />
              {/* Main wing */}
              <path d="M40 58 L20 75 L25 78 L52 65Z" fill="#1A6FD4" opacity="0.8"
                style={{ transformOrigin: "40px 58px", transform: wingFlap ? "scaleY(1.15)" : "scaleY(1)", transition: "transform .15s" }} />
              <path d="M50 56 L85 42 L87 46 L55 62Z" fill="#1558b0" opacity="0.9" />
              {/* Tail */}
              <path d="M90 54 L100 44 L102 47 L93 58Z" fill="#1A6FD4" opacity="0.7" />
              {/* Windows */}
              <circle cx="55" cy="58" r="3" fill="rgba(255,255,255,.6)" />
              <circle cx="63" cy="56" r="2.5" fill="rgba(255,255,255,.5)" />
              <circle cx="70" cy="54" r="2.5" fill="rgba(255,255,255,.5)" />
              {/* Engine */}
              <ellipse cx="38" cy="68" rx="5" ry="3" fill="#0d3d7a" />
              {/* Jet glow */}
              <ellipse cx="18" cy="72" rx="6" ry="2" fill="rgba(255,160,50,.5)" opacity={excited ? "1" : "0.4"} />
            </svg>
          </div>

          <span style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
            Daddy&apos;s Jet
          </span>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-gold, #B88E3D)", marginTop: 8, opacity: 0.8 }}>
            Daddy knows a better way
          </p>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.45)", marginTop: 16, lineHeight: 1.6, maxWidth: 220 }}>
            Türkiye&apos;nin ilk empty leg özel jet platformu.
          </p>

          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["✈", "SHGM onaylı operatörler"], ["⚡", "Anında rezervasyon"], ["💰", "Tam iade garantisi"]].map(([icon, text]) => (
              <div key={text as string} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — forms */}
        <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

          {/* ── SIGN IN / SIGN UP ── */}
          {(screen === "signin" || screen === "signup") && (
            <>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 2, padding: 4, borderRadius: 12, background: "rgba(255,255,255,.08)", marginBottom: 24 }}>
                {(["signin", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTabSwitch(t)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      fontSize: 14,
                      fontWeight: 700,
                      border: "none",
                      borderRadius: 9,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all .2s",
                      background: tab === t ? "#fff" : "transparent",
                      color: tab === t ? "var(--color-navy, #081F41)" : "rgba(255,255,255,.5)",
                      boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,.15)" : "none",
                    }}
                  >
                    {t === "signin" ? "Giriş Yap" : "Kayıt Ol"}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {screen === "signup" && (
                  <div>
                    <label style={labelStyle}>Ad Soyad</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Adınız"
                      style={inputStyle}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>E-posta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="siz@ornek.com"
                    style={inputStyle}
                    autoComplete="email"
                    onKeyDown={(e) => e.key === "Enter" && (screen === "signin" ? handleSignIn() : handleSignUp())}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Şifre</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: 42 }}
                      autoComplete={screen === "signin" ? "current-password" : "new-password"}
                      onKeyDown={(e) => e.key === "Enter" && (screen === "signin" ? handleSignIn() : handleSignUp())}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.45)", padding: 0, lineHeight: 1 }}
                    >
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                </div>

                {/* Policy consent on sign up */}
                {screen === "signup" && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <input
                      type="checkbox"
                      id="chk-policies"
                      checked={policiesAccepted}
                      onChange={(e) => setPoliciesAccepted(e.target.checked)}
                      style={{ marginTop: 2, width: 15, height: 15, cursor: "pointer", accentColor: "#1A6FD4", flexShrink: 0 }}
                    />
                    <label htmlFor="chk-policies" style={{ fontSize: 12.5, color: "rgba(255,255,255,.5)", lineHeight: 1.6, cursor: "pointer" }}>
                      {" "}
                      <button onClick={() => setPolicyOpen({ url: "/privacy", title: "Gizlilik Politikası" })} style={{ background: "none", border: "none", color: "#1A6FD4", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", fontWeight: 700, padding: 0 }}>Gizlilik Politikası</button>,{" "}
                      <button onClick={() => setPolicyOpen({ url: "/terms", title: "Kullanım Şartları" })} style={{ background: "none", border: "none", color: "#1A6FD4", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", fontWeight: 700, padding: 0 }}>Kullanım Şartları</button>,{" "}
                      <button onClick={() => setPolicyOpen({ url: "/refund", title: "İade Politikası" })} style={{ background: "none", border: "none", color: "#1A6FD4", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", fontWeight: 700, padding: 0 }}>İade Politikası</button>{" "}
                      ve{" "}
                      <button onClick={() => setPolicyOpen({ url: "/kvkk", title: "KVKK" })} style={{ background: "none", border: "none", color: "#1A6FD4", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", fontWeight: 700, padding: 0 }}>KVKK</button>
                      {" "}metnini okudum, kabul ediyorum.
                    </label>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button
                style={{ ...btnPrimary, marginTop: 20 }}
                onClick={screen === "signin" ? handleSignIn : handleSignUp}
                disabled={loading}
              >
                {loading ? "Yükleniyor…" : screen === "signin" ? "Giriş Yap" : "Kayıt Ol"}
              </button>

              {screen === "signin" && (
                <button
                  onClick={() => { setForgotEmail(email); setScreen("forgot"); setError(""); }}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,.45)", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12, fontFamily: "inherit" }}
                >
                  Şifremi unuttum
                </button>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 600 }}>veya</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.12)" }} />
              </div>

              <button
                onClick={handleGoogleLogin}
                style={{
                  width: "100%",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background: "#fff",
                  color: "#1a1a1a",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 14.5,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(0,0,0,.15)",
                }}
              >
                <GoogleIcon />
                Google ile devam et
              </button>
            </>
          )}

          {/* ── EMAIL VERIFY ── */}
          {screen === "verify_email" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff" }}>E-postanızı doğrulayın</h2>
                <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
                  <strong style={{ color: "rgba(255,255,255,.8)" }}>{email}</strong> adresine 6 haneli bir kod gönderdik.
                </p>
              </div>

              <div>
                <label style={labelStyle}>Doğrulama Kodu</label>
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  style={{ ...inputStyle, textAlign: "center", letterSpacing: ".3em", fontSize: 22, fontWeight: 800 }}
                  autoComplete="one-time-code"
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
              </div>

              {error && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button style={{ ...btnPrimary, marginTop: 18 }} onClick={handleVerify} disabled={loading}>
                {loading ? "Doğrulanıyor…" : "Doğrula"}
              </button>

              <button
                onClick={handleResend}
                disabled={loading}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,.4)", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 14, fontFamily: "inherit" }}
              >
                Kodu tekrar gönder
              </button>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {screen === "forgot" && (
            <>
              <button
                onClick={() => setScreen("signin")}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,.45)", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}
              >
                ← Geri
              </button>

              <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#fff" }}>Şifreni sıfırla</h2>
              <p style={{ margin: "0 0 22px", fontSize: 13.5, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>
                E-posta adresinize şifre sıfırlama kodu göndereceğiz.
              </p>

              <div>
                <label style={labelStyle}>E-posta</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="siz@ornek.com"
                  style={inputStyle}
                  onKeyDown={(e) => e.key === "Enter" && handleForgotSubmit()}
                />
              </div>

              {error && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button style={{ ...btnPrimary, marginTop: 18 }} onClick={handleForgotSubmit} disabled={loading}>
                {loading ? "Gönderiliyor…" : "Kod Gönder"}
              </button>
            </>
          )}

          {/* ── RESET PASSWORD ── */}
          {screen === "reset_password" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔑</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff" }}>Yeni şifrenizi belirleyin</h2>
                <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "rgba(255,255,255,.5)" }}>
                  <strong style={{ color: "rgba(255,255,255,.8)" }}>{email}</strong> adresine gelen kodu girin.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Doğrulama Kodu</label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    style={{ ...inputStyle, textAlign: "center", letterSpacing: ".3em", fontSize: 20 }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Yeni Şifre</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: 42 }}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass((v) => !v)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.45)", padding: 0 }}
                    >
                      <EyeIcon open={showNewPass} />
                    </button>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11.5, color: "rgba(255,255,255,.35)", fontWeight: 600 }}>
                    Büyük harf, küçük harf ve rakam içermeli
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button style={{ ...btnPrimary, marginTop: 20 }} onClick={handleResetPassword} disabled={loading}>
                {loading ? "Kaydediliyor…" : "Şifreyi Güncelle"}
              </button>
            </>
          )}

          {/* ── RESET DONE ── */}
          {screen === "reset_done" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>Şifreniz güncellendi!</h2>
              <p style={{ margin: "12px 0 28px", fontSize: 14, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
                Artık yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <button
                style={btnPrimary}
                onClick={() => { setScreen("signin"); setTab("signin"); setPassword(""); setResetCode(""); setNewPassword(""); }}
              >
                Giriş Yap
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Policy modal */}
      {policyOpen && (
        <div
          onClick={() => setPolicyOpen(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 680,
              maxHeight: "80vh",
              borderRadius: 20,
              background: "#0d2545",
              border: "1px solid rgba(255,255,255,.12)",
              boxShadow: "0 24px 64px rgba(0,0,0,.5)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{policyOpen.title}</span>
              <button onClick={() => setPolicyOpen(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 0 }}>×</button>
            </div>
            <iframe
              src={policyOpen.url}
              style={{ flex: 1, border: "none", minHeight: "60vh" }}
              title={policyOpen.title}
            />
            <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setPolicyOpen(null)}
                style={{ padding: "9px 20px", fontSize: 13.5, fontWeight: 700, background: "rgba(255,255,255,.1)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}
              >
                Kapat
              </button>
              <button
                onClick={() => { setPoliciesAccepted(true); setPolicyOpen(null); }}
                style={{ padding: "9px 20px", fontSize: 13.5, fontWeight: 700, background: "linear-gradient(135deg, #1A6FD4, #0f4d9e)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}
              >
                Kabul Ediyorum
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .auth-card {
            grid-template-columns: 1fr !important;
          }
          .auth-brand {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#050e1f" }} />}>
      <AuthPageInner />
    </Suspense>
  );
}

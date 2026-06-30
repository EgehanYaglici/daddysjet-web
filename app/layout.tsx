import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daddy's Jet — Empty Leg Uçuşları",
  description: "Türkiye'nin ilk empty leg jet platformu. Yetkili operatörlerden boş bacak uçuşları, gerçek zamanlı fiyatlarla.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://daddysjet.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Daddy's Jet",
    description: "Empty leg uçuşlarında en iyi fiyatlar",
    siteName: "Daddy's Jet",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${hanken.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

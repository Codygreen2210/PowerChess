import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://powerchess.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PowerChess — Chess with power-ups",
    template: "%s · PowerChess",
  },
  description:
    "Chess with power-up cards. Capture pieces to earn points, then spend them on cards that freeze enemies, double your moves, or resurrect the fallen. Free to play in your browser.",
  keywords: [
    "powerchess",
    "power chess",
    "chess",
    "chess variant",
    "chess with power-ups",
    "chess card game",
    "card chess",
    "browser chess game",
    "chess with abilities",
    "two player chess",
    "chess powerups",
  ],
  authors: [{ name: "PowerChess" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "PowerChess — Chess with power-ups",
    description:
      "Chess with power-up cards. Capture pieces to earn points, then spend them on cards that change the game.",
    siteName: "PowerChess",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PowerChess — chess with power-ups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerChess — Chess with power-ups",
    description:
      "Chess with power-up cards. Capture pieces, buy cards, change the game.",
    images: ["/og.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

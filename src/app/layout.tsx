import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wandr — Your AI Travel Companion",
  description: "Plan smarter, explore further. AI-built itineraries for wherever you're headed.",
  manifest: "/manifest.json",
  themeColor: "#D4522A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wandr",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Wandr" />
        <meta name="theme-color" content="#D4522A" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

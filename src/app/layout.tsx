import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSCE Campus Navigator — 3D Satellite Map",
  description:
    "Navigate Dayananda Sagar College of Engineering campus with an interactive 3D satellite map featuring real-time turn-by-turn directions.",
  keywords: ["DSCE", "campus", "navigator", "3D map", "satellite", "navigation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

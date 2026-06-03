import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algorido AI — Sales Presentation",
  description: "Algorido AI x Velmex Partnership Presentation 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}

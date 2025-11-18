import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViralFaces AI – Put Your Face in Viral Videos Instantly",
  description: "Turn yourself into Trump, Elon, Taylor Swift or any viral trend in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

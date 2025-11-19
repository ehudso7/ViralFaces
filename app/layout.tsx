import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Analytics as CustomAnalytics } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViralFaces AI – Put Your Face in Viral Videos Instantly",
  description: "Turn yourself into Trump, Elon, Taylor Swift or any viral trend in seconds. AI-powered face swapping for ultra-realistic viral videos.",
  keywords: ["AI face swap", "viral videos", "deepfake", "face replacement", "viral moments", "AI video generator"],
  authors: [{ name: "ViralFaces AI" }],
  creator: "ViralFaces AI",
  publisher: "ViralFaces AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://viralfaces.ai",
    title: "ViralFaces AI – AI-Powered Viral Video Generator",
    description: "Create ultra-realistic face-swapped videos with trending templates. Be the star of any viral moment.",
    siteName: "ViralFaces AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ViralFaces AI – Put Your Face in Viral Videos",
    description: "AI-powered face swapping for viral videos. Upload a selfie, pick a template, get results in seconds.",
    creator: "@viralfaces",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ec4899" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ViralFaces AI",
              description:
                "AI-powered face swapping service for creating viral videos",
              url: "https://viralfaces.ai",
              applicationCategory: "MultimediaApplication",
              offers: {
                "@type": "Offer",
                price: "9.00",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-dark text-white`}>
        <ErrorBoundary>
          {children}
          <CustomAnalytics />
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

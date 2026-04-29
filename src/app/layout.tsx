import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import { PageTransition } from "@/components/portfolio/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const siteUrl = "https://azizu.dev";
const ogImageUrl = `${siteUrl}/og-image.png`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Home | Aziz Umarov",
    template: "%s | Aziz Umarov",
  },
  description: "Software Engineer · Full-Stack Developer",
  openGraph: {
    title: "Aziz Umarov | Portfolio",
    description: "Software Engineer · Full-Stack Developer",
    url: siteUrl,
    siteName: "azizu.dev",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Aziz Umarov portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aziz Umarov | Portfolio",
    description: "Software Engineer · Full-Stack Developer",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <PageTransition>{children}</PageTransition>
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </body>
    </html>
  );
}

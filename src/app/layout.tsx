import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import { PortfolioDock } from "@/components/portfolio/portfolio-dock";
import { PageTransition } from "@/components/portfolio/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://azizu.dev"),
  title: {
    default: "Abduaziz Umarov | Software Engineer",
    template: "%s | Abduaziz Umarov",
  },
  description:
    "The portfolio of Abduaziz Umarov, a UCF computer science student building research, full-stack, and product-focused software.",
  openGraph: {
    title: "Abduaziz Umarov | Software Engineer",
    description:
      "Selected experience, projects, and research work from Abduaziz Umarov.",
    url: "https://azizu.dev",
    siteName: "azizu.dev",
    type: "website",
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
          <PortfolioDock />
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </body>
    </html>
  );
}

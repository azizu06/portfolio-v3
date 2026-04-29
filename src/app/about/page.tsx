import type { Metadata } from "next";
import { AboutPageContent } from "@/components/portfolio/about-page-content";

const aboutUrl = "https://azizu.dev/about";
const ogImageUrl = "https://azizu.dev/og-image.png";

export const metadata: Metadata = {
  title: "About",
  openGraph: {
    title: "Aziz Umarov | Portfolio",
    description: "Software Engineer · Full-Stack Developer",
    url: aboutUrl,
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

export default function AboutPage() {
  return <AboutPageContent />;
}

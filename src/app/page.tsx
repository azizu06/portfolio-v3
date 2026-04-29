import type { Metadata } from "next";
import { AboutPageContent } from "@/components/portfolio/about-page-content";
import { ResponsiveHome } from "@/components/portfolio/responsive-home";

const siteUrl = "https://azizu.dev";
const ogImageUrl = `${siteUrl}/og-image.jpg`;

export const metadata: Metadata = {
  title: {
    absolute: "Home | Aziz Umarov",
  },
  openGraph: {
    title: "Aziz Umarov | Portfolio",
    description: "Software Engineer · Full-Stack Developer",
    url: siteUrl,
    images: [
      {
        url: ogImageUrl,
        width: 2400,
        height: 1260,
        type: "image/jpeg",
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

export default function Home() {
  return <ResponsiveHome mobile={<AboutPageContent />} />;
}

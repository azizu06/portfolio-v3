import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

const mobileUserAgentPattern =
  /Android|BlackBerry|iPad|iPhone|iPod|IEMobile|Mobile|Opera Mini|webOS|Windows Phone/i;

export default async function Home() {
  const userAgent = (await headers()).get("user-agent") ?? "";

  if (mobileUserAgentPattern.test(userAgent)) {
    redirect("/about");
  }

  return (
    <ResponsiveHome mobile={<AboutPageContent />} mobileRedirectPath="/about" />
  );
}

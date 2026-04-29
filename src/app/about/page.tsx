import type { Metadata } from "next";
import { AboutPageContent } from "@/components/portfolio/about-page-content";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return <AboutPageContent />;
}

import { AboutPageContent } from "@/components/portfolio/about-page-content";
import { ResponsiveHome } from "@/components/portfolio/responsive-home";

export default function Home() {
  return <ResponsiveHome mobile={<AboutPageContent />} />;
}

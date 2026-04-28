import FadeContent from "@/components/FadeContent";
import { RouteHeader } from "@/components/portfolio/route-header";
import { SkillsOrbitShowcase } from "@/components/portfolio/skills-orbit-showcase";

export default function SkillsPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-deep-navy text-ice">
      <RouteHeader />
      <FadeContent blur duration={900} threshold={0.02}>
        <SkillsOrbitShowcase />
      </FadeContent>
    </main>
  );
}

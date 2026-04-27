import { HeroStage } from "@/components/portfolio/hero-stage";
import { profile, proofPoints } from "@/data/profile";

export default function AboutPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-deep-navy text-ice">
      <HeroStage
        name={profile.name}
        role={profile.role}
        summary={profile.summary}
        resumeHref={profile.resumeHref}
        proofPoints={proofPoints}
      />
    </main>
  );
}

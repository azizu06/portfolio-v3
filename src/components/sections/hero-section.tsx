import Link from "next/link";
import { ArrowDownIcon, MapPinIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { FutsalHeroSceneLoader } from "@/components/scene/futsal-hero-scene-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-8 lg:min-h-[100dvh] lg:pb-24 lg:pt-28"
    >
      <div className="court-hero-backdrop" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <Reveal className="relative z-10 flex flex-col items-start gap-8">
          <Badge variant="secondary" className="court-badge">
            <MapPinIcon data-icon="inline-start" />
            {profile.location}
          </Badge>
          <div className="flex flex-col gap-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-lime-200/70">
              Street futsal portfolio
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl lg:text-8xl">
              {profile.shortName} turns projects into a playable court.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
              {profile.headline} Move the player, kick the ball, and use the court
              boards to jump through projects, skills, experience, and contact.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="#projects" />} size="lg" className="court-button-primary">
              Enter projects
              <ArrowDownIcon data-icon="inline-end" />
            </Button>
            <Button
              render={<Link href={profile.resumeHref} />}
              variant="outline"
              size="lg"
              className="court-button-outline"
            >
              Sideline pass
            </Button>
          </div>
          <div className="court-hero-note">
            <span>Controls</span>
            <p>WASD or arrows to move. Space or Kick to shoot.</p>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative z-10 max-lg:order-first">
          <FutsalHeroSceneLoader />
        </Reveal>
      </div>
    </section>
  );
}

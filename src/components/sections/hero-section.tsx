import Image from "next/image";
import Link from "next/link";
import { MapPinIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border/60 px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(109,93,252,0.18),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(20,184,166,0.16),transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="flex flex-col items-start gap-8">
          <Badge variant="secondary" className="rounded-full px-4 py-1">
            <MapPinIcon data-icon="inline-start" />
            {profile.location}
          </Badge>
          <div className="flex flex-col gap-5">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
              {profile.role}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl lg:text-8xl">
              {profile.name}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {profile.headline}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="#projects" />} size="lg">
              View projects
            </Button>
            <Button
              render={<Link href={profile.resumeHref} />}
              variant="outline"
              size="lg"
            >
              Open resume
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
            <Image
              src="/assets/aziz-headshot.jpeg"
              alt="Portrait of Abduaziz Umarov"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-xl border bg-background/90 p-4 shadow-xl backdrop-blur">
            <p className="text-sm text-muted-foreground">{profile.summary}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

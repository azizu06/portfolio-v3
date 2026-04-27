import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, CodeXmlIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects } from "@/data/projects";
import { SectionHeading } from "./section-heading";

export function ProjectsSection() {
  const featuredProjects = projects.filter((project) => project.featured);
  const remainingProjects = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="court-section px-5 py-24 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          eyebrow="Scoreboard"
          title="Featured builds rotate like goals on the match screen."
          description="The court can be playful, but the work stays easy to inspect: live links, source, stack, and shipped context."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} delay={index * 0.08} />
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {remainingProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              delay={index * 0.04}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  delay,
  compact = false,
}: {
  project: (typeof projects)[number];
  delay: number;
  compact?: boolean;
}) {
  return (
    <Reveal delay={delay}>
      <Card className="court-section-card group h-full overflow-hidden rounded-[1.35rem] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
        <div className={`relative bg-muted ${compact ? "h-44" : "h-56"}`}>
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <Badge variant="outline" className="border-lime-200/20 text-lime-100">
              {project.category}
            </Badge>
            <span className="text-xs text-white/45">{project.date}</span>
          </div>
          <CardTitle className="text-white">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-sm leading-6 text-white/58">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, compact ? 4 : 7).map((technology) => (
              <Badge key={technology} variant="secondary" className="bg-white/8 text-white/70">
                {technology}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="gap-3 border-white/10 bg-black/18">
          <Button
            render={
              <Link href={project.githubHref} target="_blank" rel="noreferrer" />
            }
            variant="outline"
            size="sm"
            className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/10"
          >
            <CodeXmlIcon data-icon="inline-start" />
            Code
          </Button>
          <Button
            render={
              <Link href={project.liveHref} target="_blank" rel="noreferrer" />
            }
            size="sm"
            className="rounded-full bg-lime-200 text-black hover:bg-lime-100"
          >
            Live
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>
    </Reveal>
  );
}

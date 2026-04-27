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
    <section id="projects" className="bg-muted/35 px-5 py-24 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          eyebrow="Projects"
          title="A gallery of deployed work, from full-stack products to small interaction studies."
          description="Featured projects lead the story, while the full gallery keeps every deployed build easy to inspect."
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
      <Card className="group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
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
            <Badge variant="outline">{project.category}</Badge>
            <span className="text-xs text-muted-foreground">{project.date}</span>
          </div>
          <CardTitle>{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, compact ? 4 : 7).map((technology) => (
              <Badge key={technology} variant="secondary">
                {technology}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="gap-3">
          <Button
            render={
              <Link href={project.githubHref} target="_blank" rel="noreferrer" />
            }
            variant="outline"
            size="sm"
          >
            <CodeXmlIcon data-icon="inline-start" />
            Code
          </Button>
          <Button
            render={
              <Link href={project.liveHref} target="_blank" rel="noreferrer" />
            }
            size="sm"
          >
            Live
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
        </CardFooter>
      </Card>
    </Reveal>
  );
}

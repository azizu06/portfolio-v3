"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, CodeXmlIcon } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

type ProjectSpotlightCardProps = {
  project: Project;
  className?: string;
  priority?: boolean;
};

export function ProjectSpotlightCard({
  project,
  className = "",
  priority = false,
}: ProjectSpotlightCardProps) {
  return (
    <SpotlightCard
      spotlightColor="rgba(47, 111, 237, 0.24)"
      className={`group flex min-h-[31rem] flex-col rounded-[1.25rem] border-ice/10 bg-navy/72 p-0 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ice/8">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,111,237,0.55),transparent_18rem),linear-gradient(135deg,#061427,#123e7a)]" />
        )}
      </div>
      <div className="relative z-10 flex flex-1 flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-ice/48">
              {project.date}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ice">
              {project.title}
            </h3>
          </div>
          <Badge variant="outline" className="border-ice/12 bg-ice/5 text-ice/72">
            {project.category}
          </Badge>
        </div>
        <p className="leading-7 text-ice/68">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 6).map((technology) => (
            <Badge
              key={technology}
              variant="secondary"
              className="bg-cobalt/14 text-ice/76"
            >
              {technology}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.githubHref ? (
            <Button
              render={<Link href={project.githubHref} target="_blank" rel="noreferrer" />}
              variant="outline"
              size="sm"
              className="rounded-full border-ice/12 bg-ice/6 text-ice hover:bg-ice/12"
            >
              <CodeXmlIcon data-icon="inline-start" />
              Code
            </Button>
          ) : null}
          {project.liveHref ? (
            <Button
              render={<Link href={project.liveHref} target="_blank" rel="noreferrer" />}
              size="sm"
              className="rounded-full bg-cobalt text-ice hover:bg-cobalt/85"
            >
              Live
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          ) : null}
        </div>
      </div>
    </SpotlightCard>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Code2,
  Link2,
  ExternalLink,
  InfoIcon,
  TrophyIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExperienceBorderGlow } from "@/components/portfolio/experience-border-glow";
import type { Project } from "@/data/projects";

type ProjectSpotlightCardProps = {
  project: Project;
  className?: string;
  priority?: boolean;
};

function GitHubBrandIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-current`}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.05c.98 0 1.96.13 2.88.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.77 1.06.77 2.14v3.16c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const LinksAndResourcesIcon = ExternalLink;

export function ProjectSpotlightCard({
  project,
  className = "",
  priority = false,
}: ProjectSpotlightCardProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(priority);
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (!project.previewVideo) return;

    const article = articleRef.current;
    if (!article) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsNearViewport(isVisible);

        if (isVisible) {
          setShouldLoadVideo(true);
        }
      },
      {
        rootMargin: "420px 0px",
        threshold: 0.12,
      },
    );

    observer.observe(article);

    return () => {
      observer.disconnect();
    };
  }, [project.previewVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isNearViewport || document.visibilityState !== "visible") {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      video.pause();
    });
  }, [isNearViewport, shouldLoadVideo]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.visibilityState === "visible" && isNearViewport) {
        void video.play().catch(() => {
          video.pause();
        });
      } else {
        video.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isNearViewport]);

  const handleMediaLoaded = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isNearViewport && document.visibilityState === "visible") {
      void video.play().catch(() => {
        video.pause();
      });
    }
  };
  const visibleTechnologies = project.technologies.slice(0, 3);
  const hiddenTechnologyCount = project.technologies.length - visibleTechnologies.length;

  return (
    <>
      <ExperienceBorderGlow
        className={`group h-full rounded-[1.35rem] ${className}`}
        glowIntensity={1.6}
        glowRadius={68}
        coneSpread={38}
        fillOpacity={0.46}
        edgeSensitivity={8}
        borderRadius={26}
      >
        <Card className="overflow-hidden rounded-[inherit] border-ice/10 bg-navy/76 py-0 shadow-none ring-1 ring-ice/8 outline outline-1 outline-ice/12">
          <div
            ref={articleRef}
            className="relative aspect-[16/9] min-h-[22rem] overflow-hidden px-7 py-10 sm:px-9"
          >
            {project.previewVideo ? (
              <>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    priority={priority}
                    sizes="(min-width: 1536px) 31vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover object-center"
                  />
                ) : null}
                <video
                  ref={videoRef}
                  src={shouldLoadVideo ? project.previewVideo : undefined}
                  poster={project.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  onLoadedData={handleMediaLoaded}
                  aria-label={`${project.title} interaction preview`}
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
                />
              </>
            ) : project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                priority={priority}
                sizes="(min-width: 1536px) 31vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,111,237,0.55),transparent_18rem),linear-gradient(135deg,#061427,#123e7a)]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,39,0)_0%,rgba(6,20,39,0.42)_36%,rgba(6,20,39,0.78)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_84%,rgba(6,20,39,0.48),transparent_16rem)]" />
            <div className="absolute bottom-7 left-7 right-7 sm:bottom-8 sm:left-8">
              <h2 className="max-w-full whitespace-nowrap font-mono text-[clamp(1.35rem,1.75vw,2rem)] font-black leading-none tracking-tight text-ice drop-shadow-[0_4px_22px_rgba(0,0,0,0.62)]">
                {project.title}
              </h2>
            </div>
            {project.award ? (
              <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-xl border border-sky-300/45 bg-cobalt px-4 py-2.5 font-mono text-lg font-black leading-none text-ice shadow-[0_16px_34px_rgba(47,111,237,0.28)]">
                <TrophyIcon className="h-5 w-5" aria-hidden="true" />
                Winner
              </div>
            ) : null}
          </div>

          <CardContent className="bg-navy/86 p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3.5 font-mono text-xl font-bold uppercase tracking-[0.08em] text-ice/78">
              <span className="inline-flex items-center gap-2.5">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                {project.date}
              </span>
            </div>

            <p className="mt-7 line-clamp-3 max-w-2xl border-y border-ice/14 py-6 text-xl font-semibold leading-8 tracking-tight text-ice sm:text-2xl sm:leading-9">
              {project.description}
            </p>

            <div className="mt-7">
              <p className="flex items-center gap-2 font-mono text-xl font-black text-ice/90">
                <Code2 className="h-5 w-5" aria-hidden="true" />
                Technologies
              </p>
              <div className="mt-4 flex min-h-14 flex-nowrap gap-3 overflow-hidden">
                {visibleTechnologies.map((technology) => (
                  <Badge
                    key={technology}
                    variant="outline"
                    className="shrink-0 rounded-xl border-blue-300/70 bg-cobalt/18 px-6 py-4 font-mono text-lg font-black leading-none tracking-[0.04em] text-ice shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]"
                  >
                    {technology}
                  </Badge>
                ))}
                {hiddenTechnologyCount > 0 ? (
                  <Badge
                    variant="outline"
                    className="shrink-0 rounded-xl border-blue-300/70 bg-cobalt/18 px-6 py-4 font-mono text-lg font-black leading-none tracking-[0.04em] text-sky-200 shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]"
                  >
                    +{hiddenTechnologyCount}
                  </Badge>
                ) : null}
              </div>
            </div>

            <div className="mt-8 flex gap-4 pt-6">
              <Button
                size="sm"
                variant="outline"
                className="group/button h-11 flex-1 rounded-full border-ice/16 bg-ice/7 px-6 py-3 text-lg font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/45 hover:bg-ice/13 active:scale-[0.98]"
                onClick={() => setIsDetailsOpen(true)}
              >
                View details
                <span className="ml-1 inline-flex size-7 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5">
                  <InfoIcon className="size-5" aria-hidden="true" />
                </span>
              </Button>
              <Button
                render={
                  <Link
                    href={project.liveHref ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                size="sm"
                className="group/button h-11 flex-1 rounded-full bg-cobalt px-6 py-3 text-lg font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:bg-cobalt/85 active:scale-[0.98]"
              >
                Live demo
                <span className="ml-1 inline-flex size-7 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5">
                  <Link2 className="size-5" aria-hidden="true" />
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </ExperienceBorderGlow>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent
          showCloseButton={false}
          className="!w-[min(96vw,112rem)] !max-w-none sm:!max-w-[min(96vw,112rem)] !max-h-[96dvh] overflow-hidden rounded-[1.55rem] border border-ice/14 bg-[#071324]/96 p-0 text-ice shadow-[0_34px_140px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
        >
          <DialogClose
            render={
              <Button
                variant="outline"
                size="icon"
                className="absolute right-5 top-5 z-30 size-13 rounded-full border-ice/35 bg-[#071324]/82 text-ice shadow-[0_16px_42px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/70 hover:bg-cobalt"
              />
            }
          >
            <XIcon className="size-7" aria-hidden="true" />
            <span className="sr-only">Close project details</span>
          </DialogClose>
          <div className="max-h-[96dvh] overflow-y-auto">
            <div className="relative min-h-[56dvh] overflow-hidden rounded-t-[1.55rem] bg-[#061427] sm:min-h-[46rem]">
              {project.previewVideo ? (
                <video
                  src={project.previewVideo}
                  poster={project.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`${project.title} expanded preview`}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,111,237,0.55),transparent_18rem),linear-gradient(135deg,#061427,#123e7a)]" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,39,0)_18%,rgba(6,20,39,0.24)_48%,rgba(6,20,39,0.86)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_84%,rgba(6,20,39,0.54),transparent_22rem)]" />
              {project.award ? (
                <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-xl border border-sky-300/45 bg-cobalt px-5 py-3 font-mono text-xl font-black leading-none text-ice shadow-[0_16px_34px_rgba(47,111,237,0.28)]">
                  <TrophyIcon className="h-5 w-5" aria-hidden="true" />
                  Winner
                </div>
              ) : null}
              <div className="absolute bottom-8 left-8 right-8">
                <DialogTitle className="font-mono text-[clamp(2.55rem,4.3vw,5.3rem)] font-black leading-none tracking-tight text-ice drop-shadow-[0_4px_22px_rgba(0,0,0,0.62)]">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="mt-6 flex items-center gap-3 font-mono text-2xl font-bold uppercase tracking-[0.08em] text-ice/84">
                  <CalendarDays className="h-6 w-6" aria-hidden="true" />
                  {project.date}
                </DialogDescription>
              </div>
            </div>

            <div className="bg-navy/92 flex flex-col gap-10 p-10 sm:p-11">
              <div className="grid gap-8 border-y border-ice/14 py-6 lg:grid-cols-2 lg:gap-10">
                <div className="flex min-h-[19rem] flex-col">
                  <p className="flex items-center gap-3 font-mono text-2xl font-black text-ice">
                    <InfoIcon className="h-6 w-6" aria-hidden="true" />
                    Summary
                  </p>
                  <p className="mt-5 text-2xl font-semibold leading-9 tracking-tight text-ice">
                    {project.details ?? project.description}
                  </p>
                </div>

                {project.keyFeatures?.length ? (
                  <div className="flex min-h-[19rem] flex-col">
                    <p className="flex items-center gap-3 font-mono text-2xl font-black text-ice">
                      <Code2 className="h-6 w-6" aria-hidden="true" />
                      Key Features
                    </p>
                    <ul className="mt-5 space-y-3.5 text-ice">
                      {project.keyFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-4 text-2xl font-semibold leading-9 tracking-tight text-ice"
                        >
                          <span
                            className="mt-3 h-2 w-2 shrink-0 rounded-full bg-sky-300 shadow-[0_0_0_5px_rgba(87,178,255,0.11)]"
                            aria-hidden="true"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div>
                <p className="flex items-center gap-3 font-mono text-2xl font-black text-ice/90">
                  <Code2 className="h-6 w-6" aria-hidden="true" />
                  Technologies & Skills
                </p>
                <div className="mt-6 flex flex-wrap gap-5">
                  {project.technologies.map((technology) => (
                    <Badge
                      key={technology}
                      variant="outline"
                      className="rounded-xl border-blue-300/70 bg-cobalt/18 px-8 py-4 font-mono text-xl font-black leading-none tracking-[0.04em] text-ice shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]"
                    >
                      {technology}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-ice/14 pt-8">
                <p className="flex w-fit items-center gap-2.5 font-mono text-2xl font-black uppercase tracking-[0.08em] text-ice">
                  <LinksAndResourcesIcon className="size-6" />
                  Links & Resources
                </p>
                <div className="mt-5 grid max-w-[32rem] grid-cols-2 gap-4 justify-items-center">
                  <Button
                    render={
                      <Link
                        href={project.githubHref ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    variant="outline"
                    size="sm"
                    className="h-11 w-full max-w-[14.5rem] justify-center rounded-full border-ice/16 bg-ice/7 px-5 py-3 text-lg font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/45 hover:bg-ice/13 active:scale-[0.98]"
                  >
                    <GitHubBrandIcon />
                    GitHub
                  </Button>
                  <Button
                    render={
                      <Link
                        href={project.liveHref ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    size="sm"
                    className="group/button h-11 w-full max-w-[14.5rem] justify-center rounded-full bg-cobalt px-5 py-3 text-lg font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:bg-cobalt/85 active:scale-[0.98]"
                  >
                    Live demo
                    <span className="ml-1 inline-flex size-7 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5">
                      <Link2 className="size-6" aria-hidden="true" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

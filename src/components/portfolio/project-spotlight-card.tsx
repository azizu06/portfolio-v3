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

function useVisibleTechnologyCount() {
  return 3;
}

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
  const visibleTechnologyCount = useVisibleTechnologyCount();
  const visibleTechnologies = project.technologies.slice(0, visibleTechnologyCount);
  const hiddenTechnologyCount = project.technologies.length - visibleTechnologies.length;
  const previewMediaClass = "object-cover object-center";
  const modalMediaClass = "object-cover object-center";

  return (
    <>
      <ExperienceBorderGlow
        className={`group h-full min-w-0 rounded-[1.35rem] ${className}`}
        glowIntensity={1.6}
        glowRadius={68}
        coneSpread={38}
        fillOpacity={0.46}
        edgeSensitivity={8}
        borderRadius={26}
      >
        <Card className="flex h-full min-w-0 flex-col overflow-hidden rounded-[inherit] border-ice/10 bg-navy/76 py-0 shadow-none ring-1 ring-ice/8 outline outline-1 outline-ice/12">
          <div
            ref={articleRef}
            className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#061427] px-5 py-8 sm:aspect-[16/9] sm:min-h-[22rem] sm:px-9 sm:py-10"
          >
            {project.previewVideo ? (
              <>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    priority={priority}
                    sizes="(min-width: 1280px) 44vw, (min-width: 768px) 86vw, 100vw"
                    className={previewMediaClass}
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
                  className={`absolute inset-0 h-full w-full ${previewMediaClass} opacity-100`}
                />
              </>
            ) : project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                priority={priority}
                sizes="(min-width: 1280px) 44vw, (min-width: 768px) 86vw, 100vw"
                className={previewMediaClass}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,111,237,0.55),transparent_18rem),linear-gradient(135deg,#061427,#123e7a)]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,39,0)_0%,rgba(6,20,39,0.42)_36%,rgba(6,20,39,0.78)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_84%,rgba(6,20,39,0.48),transparent_16rem)]" />
            <div className="absolute bottom-7 left-7 right-7 min-w-0 sm:bottom-8 sm:left-8">
              <h2 className="max-w-full break-words font-mono text-[clamp(1.15rem,5.8vw,1.75rem)] font-black leading-none tracking-tight text-ice drop-shadow-[0_4px_22px_rgba(0,0,0,0.62)] sm:text-[clamp(1.35rem,1.75vw,2rem)]">
                {project.title}
              </h2>
            </div>
            {project.award ? (
              <div className="absolute left-4 top-4 z-30 inline-flex max-w-[calc(100%-2rem)] items-center gap-1.5 rounded-xl border border-sky-300/60 bg-cobalt px-3 py-2 font-mono text-sm font-black leading-none text-ice shadow-[0_16px_34px_rgba(47,111,237,0.32)] ring-1 ring-ice/18 sm:left-auto sm:right-5 sm:top-5 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-lg">
                <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Winner
              </div>
            ) : null}
          </div>

          <CardContent className="flex min-w-0 flex-1 flex-col bg-navy/86 p-5 sm:p-9">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-sm font-bold uppercase tracking-[0.08em] text-ice/78 sm:gap-x-7 sm:gap-y-3.5 sm:text-xl">
              <span className="inline-flex items-center gap-2.5">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                {project.date}
              </span>
            </div>

            <p className="mt-5 line-clamp-4 min-h-[10.75rem] max-w-2xl break-words border-y border-ice/14 py-5 text-lg font-semibold leading-8 tracking-tight text-ice sm:mt-7 sm:line-clamp-3 sm:min-h-[10rem] sm:py-6 sm:text-2xl sm:leading-9">
              {project.description}
            </p>

            <div className="mt-7 min-w-0">
              <p className="flex items-center gap-2 font-mono text-base font-black text-ice/90 sm:text-xl">
                <Code2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Technologies
              </p>
              <div className="mt-4 flex min-h-12 max-w-full flex-wrap gap-2.5 sm:min-h-14 sm:flex-nowrap sm:gap-3 sm:overflow-hidden">
                {visibleTechnologies.map((technology) => (
                  <Badge
                    key={technology}
                    variant="outline"
                    className="max-w-full shrink rounded-xl border-blue-300/70 bg-cobalt/18 px-4 py-3 text-center font-mono text-sm font-black leading-none tracking-[0.04em] text-ice shadow-[inset_0_0_18px_rgba(255,255,255,0.04)] sm:shrink-0 sm:px-6 sm:py-4 sm:text-lg"
                  >
                    {technology}
                  </Badge>
                ))}
                {hiddenTechnologyCount > 0 ? (
                  <Badge
                    variant="outline"
                    className="shrink-0 rounded-xl border-blue-300/70 bg-cobalt/18 px-4 py-3 text-center font-mono text-sm font-black leading-none tracking-[0.04em] text-sky-200 shadow-[inset_0_0_18px_rgba(255,255,255,0.04)] sm:px-6 sm:py-4 sm:text-lg"
                  >
                    +{hiddenTechnologyCount}
                  </Badge>
                ) : null}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:gap-4 sm:pt-9">
              <Button
                size="sm"
                variant="outline"
                className="group/button h-11 min-w-0 w-full rounded-full border-ice/16 bg-ice/7 px-5 py-3 text-base font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/45 hover:bg-ice/13 active:scale-[0.98] sm:flex-1 sm:px-6 sm:text-lg"
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
                className="group/button h-11 min-w-0 w-full rounded-full bg-cobalt px-5 py-3 text-base font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:bg-cobalt/85 active:scale-[0.98] sm:flex-1 sm:px-6 sm:text-lg"
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
          className="!max-h-[86dvh] !w-[min(92vw,76rem)] !max-w-none min-w-0 overflow-hidden rounded-[1rem] border border-ice/14 bg-[#071324]/96 p-0 text-ice shadow-[0_34px_140px_rgba(0,0,0,0.58)] backdrop-blur-2xl sm:!max-h-[88dvh] sm:rounded-[1.45rem]"
        >
          <DialogClose
            render={
              <Button
                variant="outline"
                size="icon"
                className="absolute right-3 top-3 z-30 size-10 rounded-full border-ice/35 bg-[#071324]/82 text-ice shadow-[0_16px_42px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/70 hover:bg-cobalt sm:right-5 sm:top-5 sm:size-13"
              />
            }
          >
            <XIcon className="size-5 sm:size-7" aria-hidden="true" />
            <span className="sr-only">Close project details</span>
          </DialogClose>
          <div className="max-h-[86dvh] min-w-0 overflow-y-auto sm:max-h-[88dvh]">
            <div className="isolate relative min-h-[18rem] overflow-hidden rounded-t-[1rem] bg-[#061427] sm:min-h-[28rem] lg:min-h-[30rem] sm:rounded-t-[1.45rem]">
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
                  className={`absolute inset-0 z-0 h-full w-full ${modalMediaClass}`}
                />
              ) : project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className={`${modalMediaClass} z-0`}
                />
              ) : (
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,111,237,0.55),transparent_18rem),linear-gradient(135deg,#061427,#123e7a)]" />
              )}
              <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(6,20,39,0)_18%,rgba(6,20,39,0.24)_48%,rgba(6,20,39,0.86)_100%)]" />
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_84%,rgba(6,20,39,0.54),transparent_22rem)]" />
              {project.award ? (
                <div className="absolute left-4 top-4 z-40 inline-flex max-w-[calc(100%-2rem)] transform-gpu items-center gap-1.5 rounded-xl border border-sky-300/60 bg-cobalt px-3 py-2 font-mono text-sm font-black leading-none text-ice shadow-[0_16px_34px_rgba(47,111,237,0.32)] ring-1 ring-ice/18 sm:left-8 sm:top-8 sm:gap-2 sm:px-5 sm:py-3 sm:text-xl">
                  <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  Winner
                </div>
              ) : null}
              <div className="absolute bottom-5 left-5 right-5 z-30 min-w-0 sm:bottom-8 sm:left-8 sm:right-8">
                <DialogTitle className="break-words font-mono text-[clamp(1.75rem,9vw,2.5rem)] font-black leading-none tracking-tight text-ice drop-shadow-[0_4px_22px_rgba(0,0,0,0.62)] sm:text-[clamp(2.2rem,4vw,4rem)]">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="mt-4 flex flex-wrap items-center gap-2 break-words font-mono text-base font-bold uppercase tracking-[0.08em] text-ice/84 sm:mt-5 sm:gap-3 sm:text-xl">
                  <CalendarDays className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
                  {project.date}
                </DialogDescription>
              </div>
            </div>

            <div className="bg-navy/92 flex min-w-0 flex-col gap-6 p-5 sm:gap-8 sm:p-8 lg:p-9">
              <div className="grid min-w-0 gap-7 border-y border-ice/14 py-5 sm:gap-8 sm:py-6 lg:grid-cols-2 lg:gap-9">
                <div className="flex min-w-0 flex-col">
                  <p className="flex items-center gap-2.5 font-mono text-lg font-black text-ice sm:gap-3 sm:text-xl">
                    <InfoIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    Summary
                  </p>
                  <p className="mt-4 break-words text-base font-semibold leading-7 tracking-tight text-ice sm:mt-5 sm:text-xl sm:leading-8">
                    {project.details ?? project.description}
                  </p>
                </div>

                {project.keyFeatures?.length ? (
                  <div className="flex min-w-0 flex-col">
                    <p className="flex items-center gap-2.5 font-mono text-lg font-black text-ice sm:gap-3 sm:text-xl">
                      <Code2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                      Key Features
                    </p>
                    <ul className="mt-4 space-y-3 text-ice sm:mt-5 sm:space-y-3.5">
                      {project.keyFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex min-w-0 gap-3 text-base font-semibold leading-7 tracking-tight text-ice sm:gap-4 sm:text-xl sm:leading-8"
                        >
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300 shadow-[0_0_0_5px_rgba(87,178,255,0.11)] sm:mt-3 sm:h-2 sm:w-2"
                            aria-hidden="true"
                          />
                          <span className="min-w-0 break-words">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-2.5 font-mono text-lg font-black text-ice/90 sm:gap-3 sm:text-xl">
                  <Code2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  Technologies & Skills
                </p>
                <div className="mt-4 flex flex-wrap gap-3 sm:mt-6 sm:gap-5">
                  {project.technologies.map((technology) => (
                    <Badge
                      key={technology}
                      variant="outline"
                      className="max-w-full shrink whitespace-normal break-words rounded-xl border-blue-300/70 bg-cobalt/18 px-4 py-3 text-center font-mono text-sm font-black leading-tight tracking-[0.04em] text-ice shadow-[inset_0_0_18px_rgba(255,255,255,0.04)] sm:px-6 sm:py-3.5 sm:text-lg"
                    >
                      {technology}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="min-w-0 border-t border-ice/14 pt-6 sm:pt-8">
                <p className="flex w-fit items-center gap-2.5 font-mono text-lg font-black uppercase tracking-[0.08em] text-ice sm:text-xl">
                  <LinksAndResourcesIcon className="size-5 sm:size-6" />
                  Links & Resources
                </p>
                <div className="mt-5 grid max-w-[32rem] grid-cols-1 gap-3 justify-items-center sm:grid-cols-2 sm:gap-4">
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
                    className="h-11 w-full max-w-none justify-center rounded-full border-ice/16 bg-ice/7 px-5 py-3 text-base font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/45 hover:bg-ice/13 active:scale-[0.98] sm:max-w-[14.5rem] sm:text-lg"
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
                    className="group/button h-11 w-full max-w-none justify-center rounded-full bg-cobalt px-5 py-3 text-base font-bold text-ice transition-all duration-300 hover:-translate-y-0.5 hover:bg-cobalt/85 active:scale-[0.98] sm:max-w-[14.5rem] sm:text-lg"
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

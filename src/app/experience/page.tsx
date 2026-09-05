import type { Metadata } from "next";
import Image from "next/image";
import { Building2, CalendarDays, Code2, MapPin } from "lucide-react";
import ElectricBorder from "@/components/ElectricBorder";
import FadeContent from "@/components/FadeContent";
import GradientText from "@/components/GradientText";
import { ExperienceBorderGlow } from "@/components/portfolio/experience-border-glow";
import { PageShell } from "@/components/portfolio/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
};

const accentStyles = {
  green: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "xl:shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#08182d] via-[#0b2550] to-[#050b18]",
    mark: "bg-cobalt/18 text-ice",
  },
  blue: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "xl:shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#08182d] via-[#0b2550] to-[#050b18]",
    mark: "bg-cobalt/18 text-ice",
  },
  cyan: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "xl:shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#edf4ff] via-[#82c8e5] to-[#6d8196]",
    mark: "bg-cobalt/18 text-ice",
  },
  violet: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "xl:shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#08182d] via-[#0b2550] to-[#050b18]",
    mark: "bg-cobalt/18 text-ice",
  },
};

const experienceMediaClass =
  "object-contain object-center";
const transparentExperienceMediaClass =
  "object-contain object-center p-8 sm:p-14";

export default function ExperiencePage() {
  return (
    <PageShell
      eyebrow=""
      title="Experience"
      titleClassName="mx-auto text-center"
      titleNode={
        <FadeContent as="span" blur duration={900} threshold={0.02}>
          <div className="inline-flex w-fit flex-col items-center">
            <GradientText
              colors={["#eaf2ff", "#8db7ff", "#2f6fed", "#dbeafe"]}
              animationSpeed={9}
              direction="horizontal"
              className="w-fit text-center"
            >
              Experience
            </GradientText>
            <span className="mt-2 h-[2px] w-full rounded-full bg-gradient-to-r from-[#eaf2ff] via-[#8db7ff] to-[#2f6fed] opacity-85" />
          </div>
        </FadeContent>
      }
    >
      <FadeContent blur duration={900} delay={150} threshold={0.04}>
        <div className="relative mt-20 pb-36 xl:pb-44">
          <div className="absolute bottom-32 left-[0.55rem] top-0 z-0 w-2 xl:bottom-40 xl:left-1/2 xl:w-3 xl:-translate-x-1/2">
            <ElectricBorder
              color="#2f6fed"
              speed={0.78}
              chaos={0.068}
              thickness={2}
              borderRadius={999}
              tight
              className="h-full w-full rounded-full opacity-90"
            >
              <div className="mx-auto h-full w-px rounded-full bg-gradient-to-b from-cobalt/0 via-[#8db7ff] to-cobalt/0 shadow-[0_0_14px_rgba(47,111,237,0.5)] xl:w-[2px] xl:shadow-[0_0_22px_rgba(47,111,237,0.58)]" />
            </ElectricBorder>
          </div>

          <div className="relative z-10 grid gap-8">
            {experiences.map((experience, index) => {
              const accent = accentStyles[experience.accent];
              const isLeft = index % 2 === 0;
              const dateClassName = isLeft
                ? "hidden pt-12 xl:order-1 xl:block xl:pr-4 xl:text-right"
                : "hidden pt-12 xl:order-3 xl:block xl:pl-4";
              const cardClassName = isLeft
                ? "min-w-0 xl:order-3 xl:pl-3"
                : "min-w-0 xl:order-1 xl:pr-3";
              const hasTransparentImage =
                experience.imageTreatment === "transparent";

              return (
                <FadeContent
                  key={`${experience.company}-${experience.role}`}
                  blur
                  duration={850}
                  delay={index * 140}
                  threshold={0.12}
                >
                  <article className="relative grid gap-5 pl-9 last:mb-0 xl:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] xl:items-start xl:gap-0 xl:pl-0">
                    <div className={dateClassName}>
                      <p className="font-mono text-lg font-bold uppercase tracking-[0.18em] text-ice/90">
                  {experience.dateLabel}
                  <span className="text-sky-300">.</span>
                </p>
                      <div
                        className={`mt-4 inline-block h-0.5 w-28 rounded-full ${accent.line}`}
                      />
                    </div>

                    <div className="absolute left-0 top-8 xl:static xl:order-2 xl:flex xl:justify-center xl:pt-8">
                      <div
                        className={`relative z-20 h-6 w-6 rounded-full border-2 border-deep-navy bg-gradient-to-br from-[#eaf2ff] via-[#8db7ff] to-[#2f6fed] shadow-[0_0_14px_rgba(142,191,255,0.34)] xl:h-9 xl:w-9 xl:border-4 xl:shadow-[0_0_26px_rgba(142,191,255,0.44)] ${accent.glow}`}
                      />
                    </div>

                    <div className={cardClassName}>
                      <p className="mb-3 font-mono text-lg font-bold uppercase tracking-[0.18em] text-ice/90 xl:hidden">
                        {experience.dateLabel}
                        <span className="text-sky-300">.</span>
                      </p>
                      <ExperienceBorderGlow
                        className="group rounded-[1.35rem]"
                        glowIntensity={1.6}
                        glowRadius={68}
                        mobileGlowRadius={32}
                        coneSpread={38}
                        fillOpacity={0.46}
                        edgeSensitivity={8}
                        borderRadius={26}
                      >
                        <Card className="overflow-hidden rounded-[inherit] border-ice/10 bg-navy/76 py-0 shadow-none ring-1 ring-ice/8">
                          <div
                            className={`relative aspect-[16/9] overflow-hidden ${
                              hasTransparentImage
                                ? "bg-[#1e539f]"
                                : `bg-gradient-to-br ${accent.header}`
                            }`}
                          >
                            {experience.image ? (
                              <Image
                                src={experience.image}
                                alt=""
                                fill
                                loading={index === 0 ? "eager" : "lazy"}
                                sizes="(min-width: 1280px) 44vw, 100vw"
                                className={
                                  hasTransparentImage
                                    ? transparentExperienceMediaClass
                                    : experienceMediaClass
                                }
                              />
                            ) : null}
                            {experience.animatedImage ? (
                              <Image
                                src={experience.animatedImage}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width: 1280px) 44vw, 100vw"
                                className="object-contain object-center motion-reduce:hidden"
                              />
                            ) : null}
                          </div>
                          <CardContent className="grid grid-rows-[minmax(6rem,auto)_auto_minmax(10rem,auto)_minmax(7.5rem,auto)] gap-y-4 bg-navy/86 p-5 sm:grid-rows-[minmax(5rem,auto)_auto_minmax(8.5rem,auto)_minmax(7rem,auto)] sm:gap-y-5 sm:p-8">
                            <div>
                              <h2 className="font-mono text-xl font-black leading-6 tracking-tight text-ice sm:text-2xl sm:leading-7">
                                {experience.displayRole ?? experience.role}
                              </h2>
                              <p className="mt-3 flex items-start gap-2 font-mono text-base font-bold leading-6 text-ice/85 sm:text-lg">
                                <Building2
                                  className="mt-0.5 h-4 w-4 shrink-0"
                                  aria-hidden="true"
                                />
                                {experience.displayCompany ?? experience.company}
                              </p>
                            </div>
                          <div className="flex flex-col items-start gap-2 font-mono text-sm font-bold uppercase tracking-tight text-ice/85 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between sm:text-base">
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                              {experience.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                              <CalendarDays
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                              />
                              {experience.period}
                            </span>
                          </div>

                          <p className="border-y border-ice/14 py-4 text-lg font-medium leading-7 text-ice sm:text-xl sm:leading-8">
                            {experience.summary}
                          </p>

                          <div className="pt-1">
                            <p className="flex items-center gap-2 font-mono text-base font-bold text-ice/90 sm:text-lg">
                              <Code2 className="h-5 w-5" aria-hidden="true" />
                              Technologies & Skills
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {experience.technologies.map((technology) => (
                                <Badge
                                  key={technology}
                                  variant="outline"
                                  className={`rounded-lg px-3.5 py-2.5 font-mono text-sm font-bold leading-none ${accent.chip}`}
                                >
                                  {technology}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          </CardContent>
                        </Card>
                      </ExperienceBorderGlow>
                    </div>
                  </article>
                </FadeContent>
              );
            })}
          </div>
        </div>
      </FadeContent>
    </PageShell>
  );
}

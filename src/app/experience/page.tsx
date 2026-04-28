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

const accentStyles = {
  green: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#08182d] via-[#0b2550] to-[#050b18]",
    mark: "bg-cobalt/18 text-ice",
  },
  blue: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#08182d] via-[#0b2550] to-[#050b18]",
    mark: "bg-cobalt/18 text-ice",
  },
  cyan: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#edf4ff] via-[#82c8e5] to-[#6d8196]",
    mark: "bg-cobalt/18 text-ice",
  },
  violet: {
    line: "bg-cobalt shadow-[0_0_18px_rgba(47,111,237,0.54)]",
    glow: "shadow-[0_0_28px_rgba(47,111,237,0.42)]",
    chip: "border-blue-300/70 bg-cobalt/18 text-ice",
    header: "from-[#08182d] via-[#0b2550] to-[#050b18]",
    mark: "bg-cobalt/18 text-ice",
  },
};

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
        <div className="relative mt-20 pb-36 md:pb-44">
          <div className="absolute left-[0.7rem] top-0 z-0 w-3 md:left-1/2 md:-translate-x-1/2 md:bottom-40 bottom-32">
            <ElectricBorder
              color="#60a5fa"
              speed={1.9}
              chaos={0.08}
              borderRadius={999}
              className="h-full w-full rounded-full opacity-90"
            >
              <div className="mx-auto h-full w-[2px] rounded-full bg-gradient-to-b from-cobalt/0 via-sky-300 to-cobalt/0 shadow-[0_0_22px_rgba(96,165,250,0.56)]" />
            </ElectricBorder>
          </div>

          <div className="relative z-10 grid gap-8">
            {experiences.map((experience, index) => {
              const accent = accentStyles[experience.accent];
              const isLeft = index % 2 === 0;
              const dateClassName = isLeft
                ? "hidden pt-12 md:order-1 md:block md:pr-4 md:text-right"
                : "hidden pt-12 md:order-3 md:block md:pl-4";
              const cardClassName = isLeft
                ? "min-w-0 md:order-3 md:pl-3"
                : "min-w-0 md:order-1 md:pr-3";
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
                  <article className="relative grid gap-5 pl-12 last:mb-0 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] md:items-start md:gap-0 md:pl-0">
                    <div className={dateClassName}>
                      <p className="font-mono text-lg font-bold uppercase tracking-[0.18em] text-ice/90">
                  {experience.dateLabel}
                  <span className="text-sky-300">.</span>
                </p>
                      <div
                        className={`mt-4 inline-block h-0.5 w-28 rounded-full ${accent.line}`}
                      />
                    </div>

                    <div className="absolute left-0 top-8 md:static md:order-2 md:flex md:justify-center md:pt-8">
                      <div
                        className={`relative z-20 h-9 w-9 rounded-full border-4 border-deep-navy bg-gradient-to-br from-[#eaf2ff] via-[#8db7ff] to-[#2f6fed] shadow-[0_0_26px_rgba(142,191,255,0.44)] ${accent.glow}`}
                      />
                    </div>

                    <div className={cardClassName}>
                      <p className="mb-3 font-mono text-lg font-bold uppercase tracking-[0.18em] text-ice/90 md:hidden">
                        {experience.dateLabel}
                        <span className="text-sky-300">.</span>
                      </p>
                      <ExperienceBorderGlow
                        className="group rounded-[1.35rem]"
                        glowIntensity={1.6}
                        glowRadius={68}
                        coneSpread={38}
                        fillOpacity={0.46}
                        edgeSensitivity={8}
                        borderRadius={26}
                      >
                        <Card className="overflow-hidden rounded-[inherit] border-ice/10 bg-navy/76 py-0 shadow-none ring-1 ring-ice/8">
                          <div
                            className={`relative aspect-[16/9] min-h-[22rem] overflow-hidden px-7 py-10 sm:px-9 ${
                              hasTransparentImage
                                ? "bg-transparent"
                                : `bg-gradient-to-br ${accent.header}`
                            }`}
                          >
                            {experience.image ? (
                              <Image
                                src={experience.image}
                                alt=""
                                fill
                                sizes="(min-width: 768px) 44vw, 100vw"
                                className={
                                  hasTransparentImage
                                    ? "object-contain p-8 pb-28 drop-shadow-[0_18px_34px_rgba(47,111,237,0.24)] sm:p-10 sm:pb-28"
                                    : "object-cover"
                                }
                              />
                            ) : null}
                            {!hasTransparentImage ? (
                              <>
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,39,0)_0%,rgba(6,20,39,0)_42%,rgba(6,20,39,0.66)_100%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_84%,rgba(6,20,39,0.48),transparent_16rem)]" />
                              </>
                            ) : null}
                            <div className="absolute bottom-7 left-7 right-7 sm:bottom-8 sm:left-8">
                              <h2 className="max-w-full whitespace-nowrap font-mono text-[clamp(1.35rem,1.75vw,2rem)] font-black leading-none tracking-tight text-ice drop-shadow-[0_4px_22px_rgba(0,0,0,0.62)]">
                                {experience.displayRole ?? experience.role}
                              </h2>
                              <p className="mt-4 flex items-center gap-2.5 font-mono text-xl font-black text-ice drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
                                <Building2
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                                {experience.company}
                              </p>
                            </div>
                          </div>

                          <CardContent className="bg-navy/86 p-7 sm:p-9">
                          <div className="flex flex-wrap gap-x-7 gap-y-3.5 font-mono text-xl font-bold uppercase tracking-[0.08em] text-ice/78">
                            <span className="inline-flex items-center gap-2.5">
                              <MapPin className="h-5 w-5" aria-hidden="true" />
                              {experience.location}
                            </span>
                            <span className="inline-flex items-center gap-2.5">
                              <CalendarDays
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              {experience.period}
                            </span>
                          </div>

                          <p className="mt-7 max-w-2xl border-y border-ice/14 py-6 text-xl font-semibold leading-8 tracking-tight text-ice sm:text-2xl sm:leading-9">
                            {experience.summary}
                          </p>

                          <div className="mt-7">
                            <p className="flex items-center gap-2 font-mono text-xl font-black text-ice/90">
                              <Code2 className="h-4 w-4" aria-hidden="true" />
                              Technologies & Skills
                            </p>
                            <div className="mt-4 flex flex-wrap gap-6">
                              {experience.technologies.map((technology) => (
                                <Badge
                                  key={technology}
                                  variant="outline"
                                  className={`rounded-xl px-8 py-4 font-mono text-lg font-black leading-none tracking-[0.04em] shadow-[inset_0_0_18px_rgba(255,255,255,0.04)] ${accent.chip}`}
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

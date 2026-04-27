import Image from "next/image";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { experiences } from "@/data/experience";
import { SectionHeading } from "./section-heading";

export function ExperienceSection() {
  return (
    <section id="experience" className="court-section px-5 py-24 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          eyebrow="Trophy wall"
          title="Research and engineering work worth putting behind glass."
          description="The trophy wall keeps the serious work readable while the court gives it a stronger personal frame."
        />

        <div className="grid gap-6">
          {experiences.map((experience, index) => (
            <Reveal key={experience.company} delay={index * 0.08}>
              <Card className="court-section-card overflow-hidden rounded-[1.6rem]">
                <div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-72 bg-muted">
                    <Image
                      src={experience.image}
                      alt={experience.company}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardHeader>
                      <CardDescription className="text-lime-200/70">
                        {experience.company}
                      </CardDescription>
                      <CardTitle className="text-2xl text-white">
                        {experience.role}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 text-sm text-white/52">
                        <span className="inline-flex items-center gap-2">
                          <CalendarIcon className="size-4" />
                          {experience.period}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPinIcon className="size-4" />
                          {experience.location}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      <p className="leading-7 text-white/62">
                        {experience.summary}
                      </p>
                      <ul className="grid gap-3 text-sm leading-6 text-white/78">
                        {experience.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-3">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-200" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((technology) => (
                          <Badge key={technology} variant="secondary" className="bg-white/8 text-white/75">
                            {technology}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

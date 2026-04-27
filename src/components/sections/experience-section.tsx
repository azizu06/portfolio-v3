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
    <section id="experience" className="px-5 py-24 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          eyebrow="Experience"
          title="Research and engineering work with real users in mind."
          description="A focused foundation for the experience cards. This will expand cleanly when you provide the latest resume."
        />

        <div className="grid gap-6">
          {experiences.map((experience, index) => (
            <Reveal key={experience.company} delay={index * 0.08}>
              <Card className="overflow-hidden">
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
                      <CardDescription>{experience.company}</CardDescription>
                      <CardTitle className="text-2xl">
                        {experience.role}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
                      <p className="leading-7 text-muted-foreground">
                        {experience.summary}
                      </p>
                      <ul className="grid gap-3 text-sm leading-6">
                        {experience.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((technology) => (
                          <Badge key={technology} variant="secondary">
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

import Image from "next/image";
import { PageShell } from "@/components/portfolio/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { experiences } from "@/data/experience";

export default function ExperiencePage() {
  return (
    <PageShell eyebrow="Experience" title="Experience">
      <div className="mt-14 grid gap-4">
        {experiences.map((experience) => (
          <Card
            key={`${experience.company}-${experience.role}`}
            className="rounded-[1.25rem] border-ice/10 bg-navy/72 py-0 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          >
            <CardContent className="grid gap-6 p-5 md:grid-cols-[8rem_1fr] md:p-6">
              <div className="relative h-28 overflow-hidden rounded-2xl bg-ice/8">
                <Image
                  src={experience.image}
                  alt={experience.company}
                  fill
                  sizes="8rem"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-ice">
                      {experience.role}
                    </h2>
                    <p className="mt-1 text-ice/58">
                      {experience.company} · {experience.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-ice/12 bg-ice/5 text-ice/70">
                    {experience.period}
                  </Badge>
                </div>
                <p className="mt-5 leading-7 text-ice/68">{experience.summary}</p>
                <div className="mt-5 grid gap-2">
                  {experience.highlights.map((highlight) => (
                    <p
                      key={highlight}
                      className="border-t border-ice/10 pt-3 text-sm leading-6 text-ice/62"
                    >
                      {highlight}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {experience.technologies.map((technology) => (
                    <Badge key={technology} variant="secondary" className="bg-cobalt/14 text-ice/76">
                      {technology}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, CodeXmlIcon, ContactIcon } from "lucide-react";
import { HeroStage } from "@/components/portfolio/hero-stage";
import { PortfolioDock } from "@/components/portfolio/portfolio-dock";
import { ProjectSpotlightCard } from "@/components/portfolio/project-spotlight-card";
import { SectionReveal } from "@/components/portfolio/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { experiences } from "@/data/experience";
import { profile, proofPoints } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

const featuredProjects = projects.filter((project) => project.featured);
const supportingProjects = projects.filter((project) => !project.featured).slice(0, 6);

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-deep-navy text-ice">
      <HeroStage
        name={profile.name}
        role={profile.role}
        summary={profile.summary}
        resumeHref={profile.resumeHref}
        proofPoints={proofPoints}
      />

      <PortfolioDock />

      <section
        id="projects"
        className="relative overflow-hidden px-5 py-28 sm:px-8 md:py-40"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-ice/10" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-ice/46">
                Selected work
              </p>
              <h2 className="mt-5 max-w-3xl text-[clamp(2.6rem,5vw,5.2rem)] font-semibold leading-[0.95] tracking-tight text-ice">
                <SectionReveal text="Projects" />
              </h2>
            </div>
          </div>

          <div className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 lg:grid-cols-12">
            {featuredProjects.map((project, index) => (
              <ProjectSpotlightCard
                key={project.title}
                project={project}
                priority={index === 0}
                className={
                  index === 0
                    ? "lg:col-span-7"
                    : index === 1
                      ? "lg:col-span-5"
                      : "lg:col-span-12"
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="px-5 py-28 sm:px-8 md:py-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.76fr_1.24fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-ice/46">
              Experience
            </p>
            <h2 className="mt-5 max-w-xl text-[clamp(2.4rem,4.6vw,4.9rem)] font-semibold leading-[0.96] tracking-tight">
              <SectionReveal text="Experience" />
            </h2>
          </div>

          <div className="grid gap-4">
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
                        <h3 className="text-2xl font-semibold tracking-tight">
                          {experience.role}
                        </h3>
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
                        <p key={highlight} className="border-t border-ice/10 pt-3 text-sm leading-6 text-ice/62">
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
        </div>
      </section>

      <section id="skills" className="px-5 py-28 sm:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <h2 className="max-w-4xl text-[clamp(2.4rem,4.8vw,5rem)] font-semibold leading-[0.95] tracking-tight">
              <SectionReveal text="Skills" />
            </h2>
          </div>

          <div className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
            {skillGroups.map((group, index) => (
              <Card
                key={group.title}
                className={`rounded-[1.25rem] border-ice/10 bg-navy/72 shadow-[0_18px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl ${
                  index === 0 || index === 2 ? "lg:col-span-7" : "lg:col-span-5"
                }`}
              >
                <CardContent className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-ice/44">
                    {group.title}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="h-8 rounded-full border-ice/12 bg-ice/6 px-3 text-ice/78"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-28 sm:px-8 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {supportingProjects.map((project) => (
              <Link
                key={project.title}
                href={project.liveHref ?? project.githubHref ?? "#projects"}
                target={project.liveHref || project.githubHref ? "_blank" : undefined}
                rel={project.liveHref || project.githubHref ? "noreferrer" : undefined}
                className="group rounded-[1.25rem] border border-ice/10 bg-navy/72 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
                  <ArrowUpRightIcon className="size-4 text-ice/44 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-ice/62">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 pb-32 pt-20 sm:px-8 md:pb-44">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-ice/10 bg-navy p-8 text-ice shadow-[0_40px_140px_rgba(0,0,0,0.28)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-ice/48">
                Contact
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.4rem)] font-semibold leading-[0.93] tracking-tight">
                GitHub, LinkedIn, and resume.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button
                render={<Link href="https://github.com/azizu06" target="_blank" rel="noreferrer" />}
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-ice/14 bg-deep-navy/6 px-5 text-ice hover:bg-deep-navy/12"
              >
                <CodeXmlIcon data-icon="inline-start" />
                GitHub
              </Button>
              <Button
                render={<Link href="https://www.linkedin.com/in/abduaziz-umarov/" target="_blank" rel="noreferrer" />}
                size="lg"
                className="h-12 rounded-full bg-cobalt px-5 text-ice hover:bg-cobalt/85"
              >
                <ContactIcon data-icon="inline-start" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

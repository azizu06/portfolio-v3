import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { PageShell } from "@/components/portfolio/page-shell";
import { ProjectSpotlightCard } from "@/components/portfolio/project-spotlight-card";
import { projects } from "@/data/projects";

const featuredProjects = projects.filter((project) => project.featured);
const supportingProjects = projects.filter((project) => !project.featured);

export default function ProjectsPage() {
  return (
    <PageShell eyebrow="Selected work" title="Projects">
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
                  : "lg:col-span-6"
            }
          />
        ))}
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {supportingProjects.map((project) => (
          <Link
            key={project.title}
            href={project.liveHref ?? project.githubHref ?? "/projects"}
            target={project.liveHref || project.githubHref ? "_blank" : undefined}
            rel={project.liveHref || project.githubHref ? "noreferrer" : undefined}
            className="group rounded-[1.25rem] border border-ice/10 bg-navy/72 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ice/42">
                  {project.date}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-ice">
                  {project.title}
                </h2>
              </div>
              <ArrowUpRightIcon className="size-4 text-ice/44 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-ice/62">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

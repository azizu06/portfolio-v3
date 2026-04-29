import type { Metadata } from "next";
import FadeContent from "@/components/FadeContent";
import GradientText from "@/components/GradientText";
import { PageShell } from "@/components/portfolio/page-shell";
import { ProjectSpotlightCard } from "@/components/portfolio/project-spotlight-card";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PageShell
      eyebrow=""
      title="Projects"
      titleClassName="mx-auto text-center"
      titleNode={
        <FadeContent as="span" blur duration={900} threshold={0.02}>
          <div className="inline-flex w-fit flex-col items-center py-2">
            <GradientText
              colors={["#eaf2ff", "#8db7ff", "#2f6fed", "#dbeafe"]}
              animationSpeed={9}
              direction="horizontal"
              className="w-fit text-center leading-[1.12]"
            >
              Projects
            </GradientText>
            <span className="mt-2 h-[2px] w-full rounded-full bg-gradient-to-r from-[#eaf2ff] via-[#8db7ff] to-[#2f6fed] opacity-85" />
          </div>
        </FadeContent>
      }
    >
      <div className="mx-auto mt-14 w-full max-w-[88rem] pb-30">
        <div className="grid auto-rows-fr grid-cols-1 gap-8 xl:grid-cols-2 2xl:gap-10">
          {projects.map((project, index) => (
            <ProjectSpotlightCard
              key={project.title}
              project={project}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

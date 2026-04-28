import FadeContent from "@/components/FadeContent";
import GradientText from "@/components/GradientText";
import { PageShell } from "@/components/portfolio/page-shell";
import { ProjectSpotlightCard } from "@/components/portfolio/project-spotlight-card";
import { projects } from "@/data/projects";

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
      <div className="relative left-1/2 mt-14 w-[min(calc(100vw-3rem),1920px)] -translate-x-1/2 pb-30">
        <div className="grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3 2xl:gap-8">
          {projects.map((project, index) => (
            <ProjectSpotlightCard
              key={project.title}
              project={project}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

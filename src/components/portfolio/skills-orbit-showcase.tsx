"use client";

import FadeContent from "@/components/FadeContent";
import GradientText from "@/components/GradientText";
import OrbitImages from "@/components/OrbitImages";

type Skill = {
  name: string;
  icon: string;
};

const skillGroups: { title: string; skills: Skill[] }[] = [
  {
    title: "Languages",
    skills: [
      { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
      { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
      { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
      { name: "C", icon: "https://cdn.simpleicons.org/c/A8B9CC" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" },
      { name: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
      { name: "CSS", icon: "https://cdn.simpleicons.org/css/663399" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF" },
      { name: "Express", icon: "https://cdn.simpleicons.org/express/FFFFFF" },
      { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E" },
      { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
      { name: "tRPC", icon: "https://cdn.simpleicons.org/trpc/2596BE" },
      { name: "NextAuth", icon: "https://cdn.simpleicons.org/auth0/EB5424" },
      { name: "Three.js", icon: "https://cdn.simpleicons.org/threedotjs/FFFFFF" },
      { name: "Chart.js", icon: "https://cdn.simpleicons.org/chartdotjs/FF6384" },
    ],
  },
  {
    title: "ML & Data",
    skills: [
      { name: "PyTorch", icon: "https://cdn.simpleicons.org/pytorch/EE4C2C" },
      { name: "Pandas", icon: "https://cdn.simpleicons.org/pandas/150458" },
      { name: "NumPy", icon: "https://cdn.simpleicons.org/numpy/013243" },
      { name: "scikit-learn", icon: "https://cdn.simpleicons.org/scikitlearn/F7931E" },
      { name: "Databricks", icon: "https://cdn.simpleicons.org/databricks/FF3621" },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
      { name: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
      { name: "Prisma", icon: "https://cdn.simpleicons.org/prisma/2D3748" },
      { name: "Drizzle", icon: "https://cdn.simpleicons.org/drizzle/C5F74F" },
      { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
      { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
      { name: "GitHub", icon: "https://cdn.simpleicons.org/github/FFFFFF" },
      { name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/FFFFFF" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg" },
      { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
    ],
  },
];

const orbitImages = skillGroups.flatMap((group) =>
  group.skills.map((skill) => skill.icon),
);

const orbitLabels = skillGroups.flatMap((group) =>
  group.skills.map((skill) => skill.name),
);

export function SkillsOrbitShowcase() {
  return (
    <section
      id="skills"
      className="relative isolate scroll-mt-28 px-5 pb-40 pt-28 sm:px-8 sm:pt-32 md:pb-32 lg:px-10 lg:pb-44 lg:pt-44"
    >
      <div className="mx-auto max-w-[98rem]">
        <FadeContent blur duration={900} threshold={0.16}>
          <div className="mx-auto inline-flex w-full flex-col items-center py-2 text-center">
            <GradientText
              colors={["#eaf2ff", "#8db7ff", "#2f6fed", "#dbeafe"]}
              animationSpeed={9}
              direction="horizontal"
              className="w-fit text-center text-5xl font-semibold leading-none tracking-tight md:text-7xl"
            >
              Skills
            </GradientText>
            <span className="mt-3 h-[2px] w-[min(100%,16rem)] rounded-full bg-gradient-to-r from-[#eaf2ff] via-[#8db7ff] to-[#2f6fed] opacity-85" />
          </div>
        </FadeContent>

        <FadeContent blur duration={1000} delay={120} threshold={0.12}>
          <div className="relative mx-auto mt-8 w-full max-w-[23rem] overflow-visible md:hidden">
            <OrbitImages
              images={orbitImages}
              imageLabels={orbitLabels}
              altPrefix="Skill"
              shape="ellipse"
              baseWidth={1000}
              radiusX={390}
              radiusY={450}
              rotation={-3}
              duration={54}
              itemSize={62}
              pauseOnHover
              responsive
              responsiveScaleAxis="height"
              responsiveAspectRatio="1 / 1.48"
              className="-translate-y-2"
            />
          </div>

          <div className="relative mx-auto mt-16 hidden h-[30rem] w-full max-w-[54rem] overflow-visible md:block lg:hidden">
            <OrbitImages
              images={orbitImages}
              imageLabels={orbitLabels}
              altPrefix="Skill"
              shape="ellipse"
              baseWidth={1180}
              radiusX={570}
              radiusY={270}
              rotation={-18}
              duration={54}
              itemSize={72}
              pauseOnHover
              responsive
              className="-translate-y-16"
            />
          </div>

          <div className="relative mx-auto mt-14 hidden h-[42rem] w-full max-w-[88rem] overflow-visible lg:block xl:h-[46rem]">
            <OrbitImages
              images={orbitImages}
              imageLabels={orbitLabels}
              altPrefix="Skill"
              shape="ellipse"
              baseWidth={1400}
              radiusX={650}
              radiusY={370}
              rotation={-16}
              duration={54}
              itemSize={86}
              pauseOnHover
              responsive
              className="-translate-y-32 xl:-translate-y-44"
            />
          </div>
        </FadeContent>
      </div>
    </section>
  );
}

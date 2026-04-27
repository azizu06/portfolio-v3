import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export type FutsalHotspot = {
  id: "projects" | "experience" | "skills" | "resume" | "contact";
  label: string;
  description: string;
  href: string;
};

export const sceneProjects = projects.filter((project) => project.featured);

export const sceneHotspots: FutsalHotspot[] = [
  {
    id: "projects",
    label: "Scoreboard",
    description: "Score a goal to rotate through featured project highlights.",
    href: "#projects",
  },
  {
    id: "experience",
    label: "Trophy wall",
    description: `${experiences[0]?.role ?? "Experience"} and milestone work.`,
    href: "#experience",
  },
  {
    id: "skills",
    label: "Poster wall",
    description: `${skillGroups.length} tool groups mapped like futsal posters.`,
    href: "#skills",
  },
  {
    id: "resume",
    label: "Sideline pass",
    description: "Open the latest resume from the court boards.",
    href: profile.resumeHref,
  },
  {
    id: "contact",
    label: "Final whistle",
    description: "Get in touch after the match.",
    href: "#contact",
  },
];

export const sceneStats = [
  { label: "Featured builds", value: sceneProjects.length.toString() },
  { label: "Toolkit groups", value: skillGroups.length.toString() },
  { label: "Court mode", value: "Street futsal" },
];

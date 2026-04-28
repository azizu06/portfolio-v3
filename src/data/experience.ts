type Experience = {
  company: string;
  role: string;
  displayRole?: string;
  period: string;
  location: string;
  dateLabel: string;
  image?: string;
  imageTreatment?: "cover" | "transparent";
  mark?: string;
  accent: "green" | "blue" | "cyan" | "violet";
  summary: string;
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    company: "Knight Hacks",
    role: "Software Developer",
    displayRole: "Software Developer",
    period: "Oct 2025 - Present",
    dateLabel: "Oct 2025",
    location: "Orlando, FL",
    image: "/assets/knighthacks2.webp",
    accent: "blue",
    summary:
      "Built production features for Forge, a platform supporting a 1,000+ member Knight Hacks community. I work in Next.js, TypeScript, and tRPC, shipping organizer-facing flows with strong data consistency and practical UX polish.",
    technologies: [
      "Next.js",
      "TypeScript",
      "tRPC",
      "Drizzle",
      "Tailwind CSS",
      "GitHub",
    ],
  },
  {
    company: "ISUE Lab",
    role: "Undergraduate Research Assistant",
    displayRole: "Research Assistant",
    period: "Sep 2025 - Present",
    dateLabel: "Sep 2025",
    location: "Orlando, FL",
    image: "/assets/isue-experience.png",
    accent: "cyan",
    summary:
      "Developing AI-based speech therapy feedback tools for dysarthric speakers with a focus on clinician usability. I build and refine data pipelines, PyTorch models, and evaluation workflows so feedback remains understandable and actionable during therapy sessions.",
    technologies: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "PyTorch",
      "Matplotlib",
      "Seaborn",
    ],
  },
];

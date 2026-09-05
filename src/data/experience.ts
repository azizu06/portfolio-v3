export type Experience = {
  company: string;
  role: string;
  displayRole?: string;
  period: string;
  location: string;
  dateLabel: string;
  image?: string;
  animatedImage?: string;
  imageTreatment?: "cover" | "transparent";
  mark?: string;
  accent: "green" | "blue" | "cyan" | "violet";
  summary: string;
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    company: "Versant Media",
    role: "Software Engineering Intern",
    displayRole: "Software Engineering Intern",
    period: "Sep 2026 - Apr 2027",
    dateLabel: "Sep 2026",
    location: "Orlando, FL",
    image: "/assets/versant-experience.jpeg",
    accent: "blue",
    summary:
      "Selected to work on mobile and web features for Rotten Tomatoes, including social experiences and AI-powered discovery.",
    technologies: ["Mobile", "Web", "Product Engineering"],
  },
  {
    company: "OpenAI",
    role: "Campus Lead",
    displayRole: "Campus Lead",
    period: "Aug 2026 - Present",
    dateLabel: "Aug 2026",
    location: "Orlando, FL",
    image: "/assets/openai-student-collective.png",
    animatedImage: "/assets/openai-student-collective.gif",
    accent: "violet",
    summary:
      "Representing OpenAI at the University of Central Florida through the OpenAI Student Collective, with workshops and studio hours planned for this school year.",
    technologies: ["AI Literacy", "Workshops", "Community Building"],
  },
  {
    company: "Knight Hacks",
    role: "Software Engineer Intern",
    displayRole: "Software Engineer Intern",
    period: "Jan 2026 - Present",
    dateLabel: "Jan 2026",
    location: "Orlando, FL",
    image: "/assets/knighthacks2.webp",
    accent: "blue",
    summary:
      "Building full-stack software for hackathon operations and the Knight Hacks community using Next.js, TypeScript, and tRPC.",
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
    company: "MLH Fellowship",
    role: "Founder Fellow",
    displayRole: "Founder Fellow",
    period: "Jul 2026 - Aug 2026",
    dateLabel: "Jul 2026",
    location: "Remote",
    image: "/assets/mlh-fellowship.jpg",
    imageTreatment: "transparent",
    accent: "cyan",
    summary:
      "Developed a startup idea through founder-led sessions focused on entrepreneurship and customer discovery.",
    technologies: ["Entrepreneurship", "Customer Discovery"],
  },
  {
    company: "UCF Department of Computer Science",
    role: "Undergraduate Research Assistant",
    displayRole: "Undergraduate Research Assistant",
    period: "Sep 2025 - May 2026",
    dateLabel: "Sep 2025",
    location: "Orlando, FL",
    image: "/assets/isue-experience.png",
    accent: "cyan",
    summary:
      "Analyzed speech data and developed AI-assisted feedback tools for dysarthria therapy research.",
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

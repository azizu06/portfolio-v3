export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  image: string;
  summary: string;
  highlights: string[];
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    company: "Knight Hacks",
    role: "Software Developer",
    period: "2025 - Present",
    location: "University of Central Florida",
    image: "/assets/logo.png",
    summary: "Software developer for Knight Hacks at UCF.",
    highlights: [
      "Worked on web features for the Knight Hacks developer community.",
      "Collaborated with other student developers and organizers.",
      "Built with React, TypeScript, Next.js, and Tailwind CSS.",
    ],
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
  },
  {
    company: "ISUE Lab",
    role: "Undergraduate Research Assistant",
    period: "October 2025 - Present",
    location: "University of Central Florida",
    image: "/assets/isue.png",
    summary:
      "Developing AI-driven feedback systems for dysarthric speech with a focus on usable, clinically aligned feedback.",
    highlights: [
      "Helped build and label a speech-error dataset for therapeutic feedback research.",
      "Contributed to PyTorch-based modeling work for personalized speech feedback.",
      "Participated in pilot evaluations with dysarthric speakers and clinicians.",
    ],
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
  {
    company: "Hacklytics 2026",
    role: "First Place Builder, CrisisLens",
    period: "February 2026",
    location: "Georgia Tech",
    image: "/assets/logo.png",
    summary:
      "Built CrisisLens, a hackathon product recognized as first place out of 234 projects.",
    highlights: [
      "Built for crisis analysis workflows.",
      "Prepared the product demo and judging story.",
      "Placed first at Hacklytics 2026.",
    ],
    technologies: ["React", "AI", "Data visualization", "Product strategy"],
  },
];

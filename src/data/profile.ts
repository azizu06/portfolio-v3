import {
  ArrowUpRightIcon,
  CodeXmlIcon,
  LinkIcon,
} from "lucide-react";

export const profile = {
  name: "Abduaziz Umarov",
  shortName: "Aziz",
  location: "Orlando, FL",
  role: "Software engineer and UCF computer science student",
  headline:
    "Incoming software engineering intern at Versant, OpenAI campus lead, and UCF computer science student.",
  summary:
    "A UCF computer science student building software through internships, open-source work, and projects across product engineering and infrastructure.",
  links: [
    {
      label: "GitHub",
      href: "https://github.com/azizu06",
      icon: CodeXmlIcon,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/abduaziz-umarov/",
      icon: LinkIcon,
    },
    {
      label: "Live projects",
      href: "/projects",
      icon: ArrowUpRightIcon,
    },
  ],
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
];

export const proofPoints = [
  "UCF Computer Science, 4.0 GPA",
  "Incoming Versant Software Engineering Intern",
  "OpenAI Campus Lead",
  "CrisisLens, Hacklytics 2026 first place",
];

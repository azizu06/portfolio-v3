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
  headline: "UCF CS student, ISUE Lab researcher, Knight Hacks developer.",
  summary:
    "A UCF computer science student with a 4.0 GPA, research experience in AI-assisted speech feedback, and hackathon work recognized at Hacklytics 2026.",
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
  "Knight Hacks Software Developer",
  "ISUE Lab Undergraduate Research Assistant",
  "CrisisLens, Hacklytics 2026 first place",
];

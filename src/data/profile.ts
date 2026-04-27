import {
  ArrowUpRightIcon,
  CodeXmlIcon,
  ContactIcon,
  FileTextIcon,
} from "lucide-react";

export const profile = {
  name: "Abduaziz Umarov",
  shortName: "Aziz",
  location: "Orlando, FL",
  role: "Software Engineer and Computer Science Student",
  headline:
    "I build thoughtful software across research, full-stack products, and interactive web experiences.",
  summary:
    "UCF computer science student with experience in AI-assisted speech research, hackathon product development, and full-stack web projects.",
  email: "mailto:abduaziz.umarov@example.com",
  resumeHref: "/assets/resume.pdf",
  links: [
    {
      label: "GitHub",
      href: "https://github.com/azizu06",
      icon: CodeXmlIcon,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/abduaziz-umarov/",
      icon: ContactIcon,
    },
    {
      label: "Resume",
      href: "/assets/resume.pdf",
      icon: FileTextIcon,
    },
    {
      label: "Live projects",
      href: "#projects",
      icon: ArrowUpRightIcon,
    },
  ],
};

export const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

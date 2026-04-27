"use client";

import {
  BriefcaseBusinessIcon,
  CodeXmlIcon,
  FileTextIcon,
  Layers3Icon,
  LinkIcon,
  UserRoundIcon,
} from "lucide-react";
import Dock, { type DockItemData } from "@/components/Dock";

const dockItems: DockItemData[] = [
  {
    label: "Home",
    icon: <UserRoundIcon className="size-5" />,
    onClick: () => window.location.assign("/"),
  },
  {
    label: "Projects",
    icon: <CodeXmlIcon className="size-5" />,
    onClick: () => window.location.assign("/projects"),
  },
  {
    label: "Experience",
    icon: <BriefcaseBusinessIcon className="size-5" />,
    onClick: () => window.location.assign("/experience"),
  },
  {
    label: "Skills",
    icon: <Layers3Icon className="size-5" />,
    onClick: () => window.location.assign("/skills"),
  },
  {
    label: "GitHub",
    icon: <CodeXmlIcon className="size-5" />,
    onClick: () => window.open("https://github.com/azizu06", "_blank", "noopener,noreferrer"),
  },
  {
    label: "LinkedIn",
    icon: <LinkIcon className="size-5" />,
    onClick: () => window.open("https://www.linkedin.com/in/abduaziz-umarov/", "_blank", "noopener,noreferrer"),
  },
  {
    label: "Resume",
    icon: <FileTextIcon className="size-5" />,
    onClick: () => window.open("/assets/resume.pdf", "_blank", "noopener,noreferrer"),
  },
];

export function PortfolioDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 hidden justify-center md:flex">
      <div className="pointer-events-auto relative h-20 w-full max-w-xl">
        <Dock
          items={dockItems}
          panelHeight={58}
          baseItemSize={44}
          magnification={64}
          dockHeight={110}
          className="border-[#eaf2ff]/10 bg-[#0b1f3a]/78 shadow-[0_22px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
        />
      </div>
    </div>
  );
}

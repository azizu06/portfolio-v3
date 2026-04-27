"use client";

import { FileTextIcon } from "lucide-react";
import Dock, { type DockItemData } from "@/components/Dock";

function GitHubBrandIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-current"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.05c.98 0 1.96.13 2.88.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.77 1.06.77 2.14v3.16c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedInBrandIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-current"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.76C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

const dockItems: DockItemData[] = [
  {
    label: "LinkedIn",
    icon: <LinkedInBrandIcon />,
    onClick: () => window.open("https://www.linkedin.com/in/abduaziz-umarov/", "_blank", "noopener,noreferrer"),
  },
  {
    label: "GitHub",
    icon: <GitHubBrandIcon />,
    onClick: () => window.open("https://github.com/azizu06", "_blank", "noopener,noreferrer"),
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
      <div className="pointer-events-auto relative h-20 w-full max-w-xs">
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

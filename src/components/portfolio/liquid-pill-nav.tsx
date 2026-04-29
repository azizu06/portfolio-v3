"use client";

import { useEffect, useRef, useState, type ComponentType, type MouseEvent, type SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusinessIcon,
  CodeXmlIcon,
  MonitorIcon,
  UserRoundIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PillNav from "@/components/PillNav";
import { navItems, profile } from "@/data/profile";
import type { PillNavItem } from "@/components/PillNav";

const mobileNavItems = navItems
  .filter((item) =>
    ["About", "Experience", "Projects", "Skills"].includes(item.label),
  );

type SocialNavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  external?: boolean;
};

function MobileSectionIcon({ label }: { label: string }) {
  const iconClassName = "size-5 stroke-current stroke-[2]";

  if (label === "About") {
    return <UserRoundIcon className={iconClassName} aria-hidden="true" />;
  }

  if (label === "Experience") {
    return (
      <BriefcaseBusinessIcon className={iconClassName} aria-hidden="true" />
    );
  }

  if (label === "Projects") {
    return <MonitorIcon className={iconClassName} aria-hidden="true" />;
  }

  return <CodeXmlIcon className={iconClassName} aria-hidden="true" />;
}

function GitHubBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.05c.98 0 1.96.13 2.88.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.77 1.06.77 2.14v3.16c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedInBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.76C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

const socialNavItems: SocialNavItem[] = [
  {
    label: "LinkedIn",
    href: profile.links.find((link) => link.label === "LinkedIn")?.href ?? "https://www.linkedin.com/in/abduaziz-umarov/",
    icon: LinkedInBrandIcon,
    iconClassName: "size-[1.18rem] fill-current sm:size-[1.28rem] lg:size-[1.4rem]",
    external: true,
  },
  {
    label: "GitHub",
    href: profile.links.find((link) => link.label === "GitHub")?.href ?? "https://github.com/azizu06",
    icon: GitHubBrandIcon,
    iconClassName: "size-[1.18rem] fill-current sm:size-[1.28rem] lg:size-[1.4rem]",
    external: true,
  },
];

function SocialNavLink({
  item,
}: {
  item: SocialNavItem;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className="group relative grid size-10 shrink-0 place-items-center rounded-full text-ice/80 no-underline transition-[transform,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:text-ice sm:size-11 lg:size-12"
    >
      <Icon className={item.iconClassName ?? "size-[1.35rem] fill-none stroke-current stroke-[1.7] sm:size-[1.45rem] lg:size-[1.55rem]"} />
      <span className="absolute inset-x-2 bottom-1 h-px origin-center scale-x-0 bg-ice/82 shadow-[0_0_18px_rgba(255,255,255,0.46)] transition-transform duration-300 group-hover:scale-x-100 sm:inset-x-2.5 lg:bottom-1.5" />
    </Link>
  );
}

export function LiquidPillNav({
  showLinks = true,
  onItemSelect,
  onLogoSelect,
}: {
  showLinks?: boolean;
  onItemSelect?: (item: PillNavItem) => void;
  onLogoSelect?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pressedNavHref, setPressedNavHref] = useState<string | null>(null);
  const [navHidden, setNavHidden] = useState(false);
  const routeTimeoutRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (routeTimeoutRef.current) {
        window.clearTimeout(routeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
      const delta = currentScrollY - lastScrollYRef.current;

      if (Math.abs(delta) < 4) {
        return;
      }

      if (delta > 0 && currentScrollY > 80) {
        setNavHidden(true);
      }

      if (delta < 0) {
        setNavHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileNavSelect = (
    event: MouseEvent<HTMLAnchorElement>,
    item: PillNavItem,
  ) => {
    event.preventDefault();

    if (routeTimeoutRef.current) {
      window.clearTimeout(routeTimeoutRef.current);
    }

    setPressedNavHref(item.href);
    routeTimeoutRef.current = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setPressedNavHref(null);

      if (pathname !== item.href) {
        router.push(item.href);
      }
    }, 130);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);

    if (pathname === "/" && onLogoSelect) {
      event.preventDefault();
      onLogoSelect();
    }
  };

  return (
    <>
      <nav
        className={[
          "fixed left-1/2 top-6 z-40 grid min-h-[4.5rem] w-[calc(100%-2.5rem)] grid-cols-[auto_1fr_auto] items-center gap-2 rounded-full border border-ice/18 bg-ice/[0.07] px-3 py-3 shadow-[inset_0_1px_0_rgba(234,242,255,0.2),inset_0_-1px_0_rgba(47,111,237,0.18),0_24px_90px_rgba(0,0,0,0.36),0_0_0_1px_rgba(47,111,237,0.2)] backdrop-blur-2xl transition-[opacity,filter,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform sm:gap-4 sm:px-4 md:min-h-[4.25rem] md:grid-cols-[1fr_auto_1fr] md:px-4 md:py-2",
          navHidden && !mobileMenuOpen
            ? "pointer-events-none opacity-0 blur-sm"
            : "opacity-100 blur-0",
          showLinks
            ? "max-w-7xl"
            : "w-fit justify-center",
        ].join(" ")}
        style={{
          transform:
            navHidden && !mobileMenuOpen
              ? "translate3d(-50%, calc(-100% - 3rem), 0)"
              : "translate3d(-50%, 0, 0)",
        }}
      >
        <Link
          href="/"
          aria-label="Aziz Umarov home"
          className="flex h-8 w-11 shrink-0 items-center justify-center justify-self-start overflow-visible p-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 sm:h-9 sm:w-14 md:h-8 md:w-12"
          onClick={handleLogoClick}
        >
          <Image
            src="/assets/au-logo-transparent.png"
            alt="Aziz Umarov logo"
            width={1254}
            height={1254}
            className="h-full w-full object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.28)]"
            priority
          />
        </Link>

        {showLinks ? (
          <>
            <div className="hidden min-w-0 justify-self-center md:block">
              <PillNav items={navItems.slice(1)} onItemSelect={onItemSelect} />
            </div>
            <div className="flex min-w-0 items-center justify-end gap-1 justify-self-end sm:gap-1.5 md:gap-0">
              <div className="hidden items-center gap-0 md:flex">
                {socialNavItems.map((item) => (
                  <SocialNavLink key={item.label} item={item} />
                ))}
              </div>
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                onClick={() => {
                  setNavHidden(false);
                  setMobileMenuOpen((current) => !current);
                }}
                className="group relative ml-1 grid size-11 shrink-0 place-items-center rounded-full border border-ice/14 bg-ice/[0.06] text-ice shadow-[inset_0_1px_0_rgba(234,242,255,0.18)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] sm:size-12 md:hidden"
              >
                <span className="sr-only">
                  {mobileMenuOpen ? "Close navigation" : "Open navigation"}
                </span>
                <span
                  className={[
                    "absolute h-px w-5 rounded-full bg-current transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    mobileMenuOpen
                      ? "translate-y-0 rotate-45"
                      : "-translate-y-1.5 rotate-0 group-hover:-translate-y-2",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute h-px w-5 rounded-full bg-current transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    mobileMenuOpen
                      ? "translate-y-0 -rotate-45"
                      : "translate-y-1.5 rotate-0 group-hover:translate-y-2",
                  ].join(" ")}
                />
              </button>
            </div>
          </>
        ) : null}
      </nav>

      {showLinks && mobileMenuOpen ? (
        <div
          id="mobile-navigation-menu"
          className="fixed inset-0 z-50 bg-[#061427]/92 text-ice backdrop-blur-2xl md:hidden"
          aria-hidden={!mobileMenuOpen}
        >
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="relative z-10 flex min-h-dvh flex-col px-7 py-8 text-ice"
          >
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-7 top-8 grid size-11 place-items-center text-ice/88 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white active:scale-[0.94]"
            >
              <span className="absolute h-px w-7 rotate-45 rounded-full bg-current" />
              <span className="absolute h-px w-7 -rotate-45 rounded-full bg-current" />
            </button>

            <div className="grid flex-1 place-items-center">
              <div className="flex flex-col items-center justify-center gap-8">
                {mobileNavItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const isPressed = pressedNavHref === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onPointerDown={() => setPressedNavHref(item.href)}
                      onPointerCancel={() => setPressedNavHref(null)}
                      onClick={(event) => handleMobileNavSelect(event, item)}
                      className={[
                        "inline-flex touch-manipulation select-none items-center gap-3 px-4 py-1 text-center text-xl font-semibold tracking-[-0.01em] text-white transition-[transform,color,text-shadow] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96]",
                        isPressed
                          ? "scale-[0.96] text-white [text-shadow:0_0_20px_rgba(234,242,255,0.34)]"
                        : isActive
                          ? "text-white [text-shadow:0_0_20px_rgba(234,242,255,0.28)]"
                          : "text-ice/86 hover:text-white",
                      ].join(" ")}
                      style={{
                        animation: `mobile-menu-item-in 440ms cubic-bezier(0.32,0.72,0,1) ${index * 55}ms both`,
                      }}
                    >
                      <MobileSectionIcon label={item.label} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div
              className="flex flex-col items-center gap-5 pb-7"
              style={{
                animation: `mobile-menu-item-in 520ms cubic-bezier(0.32,0.72,0,1) ${mobileNavItems.length * 55}ms both`,
              }}
            >
              <div className="flex items-center justify-center gap-7">
                {socialNavItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className="grid size-9 place-items-center text-ice/78 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:text-white active:scale-[0.94]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="size-6 fill-current" />
                    </Link>
                  );
                })}
              </div>
              <span className="h-1.5 w-14 rounded-full bg-ice/24" />
            </div>
            <style jsx>{`
              @keyframes mobile-menu-item-in {
                from {
                  opacity: 0;
                  transform: translate3d(0, 18px, 0);
                }
                to {
                  opacity: 1;
                  transform: translate3d(0, 0, 0);
                }
              }
            `}</style>
          </div>
        </div>
      ) : null}
    </>
  );
}

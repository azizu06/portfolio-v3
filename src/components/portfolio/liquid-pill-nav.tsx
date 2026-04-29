"use client";

import { useEffect, useRef, useState, type ComponentType, type MouseEvent, type SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
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
  {
    label: "Resume",
    href: profile.resumeHref,
    icon: profile.links.find((link) => link.label === "Resume")?.icon ?? (() => null),
    iconClassName: "size-[1.32rem] fill-none stroke-current stroke-[1.7] sm:size-[1.42rem] lg:size-[1.52rem]",
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

function MobileNavIcon({ label }: { label: string }) {
  const iconClassName = "size-7 shrink-0 stroke-current stroke-[1.65]";

  if (label === "About") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
        <path d="M12 12.25a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.25 20.25c.82-3.18 3.1-5.05 6.75-5.05s5.93 1.87 6.75 5.05" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (label === "Experience") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
        <path d="M8.25 7.75V6.4c0-1 .65-1.65 1.65-1.65h4.2c1 0 1.65.65 1.65 1.65v1.35" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.75 8.25h14.5v10.5H4.75z" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12.25h6M12 8.25v10.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (label === "Projects") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
        <path d="M5.25 6.75h13.5v10.5H5.25z" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.25 9.75h3.5M8.25 12h7.5M8.25 14.25h5.5M6.75 19.25h10.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName}>
      <path d="m9.25 8.25-3.5 3.75 3.5 3.75M14.75 8.25l3.5 3.75-3.5 3.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.25 6.25-2.5 11.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (Math.abs(delta) < 8) {
        return;
      }

      setNavHidden(currentScrollY > 92 && delta > 0);
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
          "grid min-h-[4.5rem] grid-cols-[auto_1fr_auto] items-center gap-2 rounded-full border border-ice/18 bg-ice/[0.07] px-3 py-3 shadow-[inset_0_1px_0_rgba(234,242,255,0.2),inset_0_-1px_0_rgba(47,111,237,0.18),0_24px_90px_rgba(0,0,0,0.36),0_0_0_1px_rgba(47,111,237,0.2)] backdrop-blur-2xl transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform sm:gap-4 sm:px-4 md:min-h-[4.25rem] md:grid-cols-[1fr_auto_1fr] md:px-4 md:py-2",
          navHidden && !mobileMenuOpen
            ? "pointer-events-none -translate-y-6 opacity-0 blur-sm"
            : "translate-y-0 opacity-100 blur-0",
          showLinks
            ? "mx-auto w-full max-w-7xl"
            : "w-fit justify-center",
        ].join(" ")}
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
              {socialNavItems.map((item) => (
                <SocialNavLink key={item.label} item={item} />
              ))}
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

      {showLinks ? (
        <div
          id="mobile-navigation-menu"
          className={[
            "fixed inset-0 z-50 md:hidden",
            mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
          aria-hidden={!mobileMenuOpen}
        >
          <button
            type="button"
            aria-label="Close navigation"
            className={[
              "absolute inset-0 bg-[#061427]/86 backdrop-blur-2xl transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
              mobileMenuOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={[
              "absolute inset-x-5 top-6 overflow-hidden rounded-[2rem] border border-ice/16 bg-[#0b1f3a]/86 p-2 text-ice shadow-[inset_0_1px_0_rgba(234,242,255,0.18),0_28px_90px_rgba(0,0,0,0.42)] transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
              mobileMenuOpen
                ? "translate-y-0 opacity-100 blur-0"
                : "-translate-y-4 opacity-0 blur-sm",
            ].join(" ")}
          >
            <div className="rounded-[calc(2rem-0.5rem)] border border-ice/10 bg-[#061427]/84 p-4 shadow-[inset_0_1px_0_rgba(234,242,255,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  aria-label="Aziz Umarov home"
                  className="flex h-9 w-14 items-center justify-center"
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
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative grid size-11 place-items-center rounded-full border border-ice/12 bg-ice/[0.06] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                >
                  <span className="absolute h-px w-5 rotate-45 rounded-full bg-current" />
                  <span className="absolute h-px w-5 -rotate-45 rounded-full bg-current" />
                </button>
              </div>

              <div className="mt-8 grid gap-2 pb-2">
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
                        "group flex touch-manipulation select-none items-center justify-between rounded-[1.35rem] border px-4 py-4 text-left text-2xl font-semibold tracking-tight transition-[transform,border-color,background-color,color,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform active:scale-[0.975]",
                        isPressed
                          ? "scale-[0.975] border-ice/34 bg-ice/[0.18] text-white shadow-[inset_0_1px_0_rgba(234,242,255,0.18),0_12px_30px_rgba(47,111,237,0.18)]"
                          : isActive
                          ? "border-ice/24 bg-ice/[0.12] text-white"
                          : "border-ice/8 bg-ice/[0.045] text-ice/72 hover:border-ice/18 hover:bg-ice/[0.08] hover:text-white",
                        mobileMenuOpen
                          ? "translate-y-0 opacity-100"
                          : "translate-y-5 opacity-0",
                      ].join(" ")}
                      style={{
                        transitionDelay: mobileMenuOpen
                          ? `${120 + index * 55}ms`
                          : "0ms",
                      }}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={[
                            "flex w-8 shrink-0 items-center justify-center transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                            isPressed || isActive ? "text-white" : "text-ice/58",
                          ].join(" ")}
                        >
                          <MobileNavIcon label={item.label} />
                        </span>
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

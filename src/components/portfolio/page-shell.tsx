import type { ReactNode } from "react";
import Aurora from "@/components/Aurora";
import { RouteHeader } from "@/components/portfolio/route-header";
import { SectionReveal } from "@/components/portfolio/section-reveal";

type PageShellProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, children }: PageShellProps) {
  return (
    <main className="relative isolate min-h-dvh w-full max-w-full overflow-x-hidden bg-deep-navy text-ice">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,#061427_0%,#0b1f3a_52%,#123e7a_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] opacity-36">
        <Aurora
          colorStops={["#061427", "#2f6fed", "#dbeafe"]}
          amplitude={0.46}
          blend={0.34}
          speed={0.55}
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_12%,rgba(47,111,237,0.18),transparent_28rem),linear-gradient(180deg,rgba(6,20,39,0)_0%,#061427_46rem)]" />

      <RouteHeader />

      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-ice/46">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-[clamp(3rem,6.4vw,6.4rem)] font-semibold leading-[0.92] tracking-tight text-ice">
            <SectionReveal text={title} />
          </h1>
          {children}
        </div>
      </section>
    </main>
  );
}

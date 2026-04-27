"use client";

import Image from "next/image";
import Aurora from "@/components/Aurora";
import SplitText from "@/components/SplitText";
import { LiquidPillNav } from "@/components/portfolio/liquid-pill-nav";

type HeroStageProps = {
  name: string;
  role: string;
  summary: string;
};

export function HeroStage({
  name,
  role,
  summary,
}: HeroStageProps) {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,#061427_0%,#0b1f3a_52%,#123e7a_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[58dvh] opacity-45">
        <Aurora
          colorStops={["#061427", "#2f6fed", "#dbeafe"]}
          amplitude={0.58}
          blend={0.42}
          speed={0.72}
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(47,111,237,0.22),transparent_30rem),linear-gradient(180deg,rgba(6,20,39,0)_0%,#061427_82%)]" />

      <LiquidPillNav />

      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col items-center justify-center py-16 text-center lg:py-24">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-cobalt/18 blur-3xl" />
          <div className="relative size-[min(19rem,72vw)] overflow-hidden rounded-full border border-cobalt/55 bg-navy/64 p-2 shadow-[0_28px_110px_rgba(47,111,237,0.3)] backdrop-blur-xl md:size-[24rem]">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-ice/8">
              <Image
                src="/assets/aziz-headshot.jpeg"
                alt={name}
                fill
                priority
                sizes="(min-width: 768px) 24rem, 72vw"
                className="object-cover grayscale-[10%] contrast-105"
              />
            </div>
          </div>
        </div>

        <p className="mt-12 font-mono text-xs uppercase tracking-[0.28em] text-ice/56">
          {role}
        </p>
        <h1 className="mt-6 max-w-5xl text-[clamp(3.2rem,7vw,7rem)] font-semibold leading-[0.92] tracking-tight text-ice">
          <SplitText
            text="Hey there, I'm Aziz"
            tag="span"
            splitType="words"
            textAlign="center"
            className="block text-ice"
            delay={70}
            from={{ opacity: 0.08, y: 34, rotateX: -22 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-ice/72 md:text-2xl md:leading-9">
          {summary}
        </p>
      </div>
    </section>
  );
}

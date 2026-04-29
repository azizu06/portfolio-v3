"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import ElectricBorder from "@/components/ElectricBorder";
import FadeContent from "@/components/FadeContent";
import GradientText from "@/components/GradientText";
import Iridescence from "@/components/Iridescence";
import ShinyText from "@/components/ShinyText";
import TextType from "@/components/TextType";
import { LiquidPillNav } from "@/components/portfolio/liquid-pill-nav";

const roleTypewriterPhrases = [
  "software engineer",
  "full stack developer",
  "computer science student",
  "undergraduate researcher",
  "hackathon builder",
];

type HeroStageProps = {
  name: string;
};

export function HeroStage({ name }: HeroStageProps) {
  const [isScrollingToMore, setIsScrollingToMore] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  function scrollToMore() {
    setIsScrollingToMore(true);

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      document
        .getElementById("about-more")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);

    resetTimeoutRef.current = window.setTimeout(
      () => setIsScrollingToMore(false),
      1100,
    );
  }

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_50%_8%,rgba(141,183,255,0.16),transparent_26rem),linear-gradient(180deg,#061427_0%,#081a31_46%,#061427_100%)]" />
      <div className="absolute inset-0 -z-20 opacity-[0.42] saturate-125 mix-blend-screen">
        <Iridescence
          color={[0.27450980392156865, 0.403921568627451, 0.6627450980392157]}
          speed={0.58}
          amplitude={0.035}
          mouseReact={false}
        />
      </div>
      <div className="absolute inset-x-[10%] bottom-[-18%] -z-20 h-[44dvh] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(47,111,237,0.18),rgba(141,183,255,0.07)_38%,transparent_72%)] blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,rgba(47,111,237,0.12),transparent_31rem),radial-gradient(circle_at_78%_18%,rgba(219,234,254,0.08),transparent_24rem),linear-gradient(180deg,rgba(6,20,39,0.18)_0%,rgba(6,20,39,0.34)_45%,#061427_100%)]" />

      <LiquidPillNav />

      <div
        className={`mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col items-center justify-start pb-32 pt-16 text-center transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:pt-20 md:pb-36 md:pt-24 lg:pb-40 lg:pt-28 ${
          isScrollingToMore
            ? "-translate-y-8 opacity-0 blur-sm"
            : "translate-y-0 opacity-100 blur-0"
        }`}
      >
        <FadeContent blur duration={900} threshold={0.02}>
          <div className="relative">
            <ElectricBorder
              color="#2f6fed"
              speed={0.82}
              chaos={0.085}
              thickness={2}
              borderRadius={9999}
              tight
              className="rounded-full opacity-100"
            >
              <div className="relative size-[min(18.5rem,76vw)] overflow-hidden rounded-full border border-sky-100/24 bg-navy/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl sm:size-[min(22rem,78vw)] md:size-[27rem] lg:size-[30rem]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-ice/8">
                  <Image
                    src="/assets/aziz-headshot.jpeg"
                    alt={name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 30rem, (min-width: 768px) 27rem, (min-width: 640px) 22rem, 76vw"
                    className="object-cover grayscale-[10%] contrast-105"
                  />
                </div>
              </div>
            </ElectricBorder>
          </div>
        </FadeContent>

        <FadeContent blur duration={900} delay={130} threshold={0.02}>
          <h1 className="mt-7 flex w-full max-w-5xl flex-wrap items-baseline justify-center gap-x-3 overflow-visible px-2 pb-1 text-[clamp(1.95rem,8vw,2.35rem)] font-semibold leading-[1.08] tracking-tight text-white md:mt-9 md:gap-x-4 md:text-[clamp(2.45rem,4.05vw,4rem)] md:leading-[1]">
            <span>Hi, I&apos;m</span>
            <GradientText
              colors={["#dbeafe", "#8db7ff", "#2f6fed", "#eaf2ff"]}
              animationSpeed={9}
              direction="horizontal"
              className="text-center"
            >
              Aziz Umarov!
            </GradientText>
          </h1>
        </FadeContent>
        <FadeContent blur duration={900} delay={260} threshold={0.02}>
          <TextType
            as="p"
            text={roleTypewriterPhrases}
            typingSpeed={58}
            deletingSpeed={34}
            pauseDuration={1500}
            initialDelay={450}
            textColors={["#ffffff"]}
            cursorCharacter="_"
            cursorClassName="text-white"
            className="mt-4 min-h-10 font-mono text-lg uppercase tracking-[0.12em] text-white sm:text-xl md:mt-5 md:min-h-12 md:text-2xl"
          />
        </FadeContent>
        <FadeContent blur duration={900} delay={360} threshold={0.02}>
          <button
            type="button"
            onClick={scrollToMore}
            className="group mt-4 flex flex-col items-center px-6 py-2 text-center transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 active:scale-[0.98] md:mt-6"
            aria-label="Scroll to more about Aziz"
          >
            <ShinyText
              text="Get to know me"
              speed={3.4}
              color="rgba(255,255,255,0.94)"
              shineColor="#ffffff"
              spread={120}
              className="text-base font-semibold tracking-tight md:text-xl"
            />
            <ChevronDownIcon
              aria-hidden="true"
              className="mt-1 size-8 animate-bounce stroke-[1.65] text-white transition duration-500 group-hover:text-white md:size-10"
            />
          </button>
        </FadeContent>
      </div>
    </section>
  );
}

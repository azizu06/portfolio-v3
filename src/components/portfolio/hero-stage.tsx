"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import ElectricBorder from "@/components/ElectricBorder";
import FadeContent from "@/components/FadeContent";
import GradientText from "@/components/GradientText";
import Iridescence from "@/components/Iridescence";
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
        className={`mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col items-center justify-center pb-36 pt-16 text-center transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:pb-40 lg:pb-44 lg:pt-24 ${
          isScrollingToMore
            ? "-translate-y-8 opacity-0 blur-sm"
            : "translate-y-0 opacity-100 blur-0"
        }`}
      >
        <FadeContent blur duration={900} threshold={0.02}>
          <div className="relative">
            <ElectricBorder
              color="#f8fbff"
              speed={0.78}
              chaos={0.052}
              borderRadius={9999}
              className="rounded-full"
            >
              <div className="relative size-[min(25rem,88vw)] overflow-hidden rounded-full border border-ice/18 bg-navy/64 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:size-[34rem]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-ice/8">
                  <Image
                    src="/assets/aziz-headshot.jpeg"
                    alt={name}
                    fill
                    priority
                    sizes="(min-width: 768px) 34rem, 88vw"
                    className="object-cover grayscale-[10%] contrast-105"
                  />
                </div>
              </div>
            </ElectricBorder>
          </div>
        </FadeContent>

        <FadeContent blur duration={900} delay={130} threshold={0.02}>
          <h1 className="mt-12 flex max-w-5xl flex-wrap items-baseline justify-center gap-x-4 text-[clamp(2.35rem,4.7vw,4.85rem)] font-semibold leading-[0.98] tracking-tight text-white">
            <span>Hey there, I&apos;m</span>
            <GradientText
              colors={["#dbeafe", "#8db7ff", "#2f6fed", "#eaf2ff"]}
              animationSpeed={9}
              direction="horizontal"
              className="text-center"
            >
              Aziz!
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
            className="mt-7 min-h-14 font-mono text-2xl uppercase tracking-[0.12em] text-white md:text-3xl"
          />
        </FadeContent>
      </div>

      <FadeContent blur duration={900} delay={430} threshold={0.02}>
        <button
          type="button"
          onClick={scrollToMore}
          className={`group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center rounded-full px-8 py-3 text-center text-sm font-medium text-white/66 transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice/60 sm:bottom-10 sm:text-base ${
            isScrollingToMore ? "opacity-0 blur-sm" : "opacity-100 blur-0"
          }`}
          aria-label="Scroll to more about Aziz"
        >
          <span className="tracking-tight">Care to learn more?</span>
          <span className="mt-4 flex size-10 items-center justify-center rounded-full border border-white/18 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-500 group-hover:border-white/36 group-hover:bg-white/[0.07] sm:size-11">
            <ChevronDownIcon
              aria-hidden="true"
              className="size-6 animate-bounce stroke-[1.75] text-white/72 transition duration-500 group-hover:text-white sm:size-7"
            />
          </span>
        </button>
      </FadeContent>
    </section>
  );
}

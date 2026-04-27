"use client";

import Image from "next/image";
import ElectricBorder from "@/components/ElectricBorder";
import GradientText from "@/components/GradientText";
import Iridescence from "@/components/Iridescence";
import TextType from "@/components/TextType";
import { LiquidPillNav } from "@/components/portfolio/liquid-pill-nav";

const roleTypewriterPhrases = [
  "software engineer",
  "computer science student",
  "undergraduate researcher",
  "hackathon builder",
];

type HeroStageProps = {
  name: string;
};

export function HeroStage({
  name,
}: HeroStageProps) {
  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_50%_8%,rgba(141,183,255,0.16),transparent_26rem),linear-gradient(180deg,#061427_0%,#081a31_46%,#061427_100%)]" />
      <div className="absolute inset-x-[-12%] top-[-18%] -z-20 h-[86dvh] opacity-36 saturate-125 mix-blend-screen">
        <Iridescence
          color={[0.27450980392156865, 0.403921568627451, 0.6627450980392157]}
          speed={0.72}
          amplitude={0.045}
          mouseReact={false}
        />
      </div>
      <div className="absolute inset-x-[12%] bottom-[-16%] -z-20 h-[38dvh] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(47,111,237,0.16),rgba(141,183,255,0.07)_38%,transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_36%,rgba(47,111,237,0.16),transparent_34rem),radial-gradient(circle_at_78%_18%,rgba(219,234,254,0.1),transparent_24rem),linear-gradient(180deg,rgba(6,20,39,0.08)_0%,rgba(6,20,39,0.42)_48%,#061427_100%)]" />

      <LiquidPillNav />

      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col items-center justify-center py-16 text-center lg:py-24">
        <div className="relative">
          <div className="absolute -inset-12 rounded-full bg-cobalt/16 blur-3xl" />
          <ElectricBorder
            color="#8db7ff"
            speed={0.36}
            chaos={0.018}
            borderRadius={9999}
            className="rounded-full"
          >
            <div className="relative size-[min(25rem,88vw)] overflow-hidden rounded-full border border-ice/18 bg-navy/64 p-2 shadow-[0_38px_140px_rgba(47,111,237,0.28)] backdrop-blur-xl md:size-[34rem]">
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

        <h1 className="mt-12 max-w-5xl text-[clamp(2.45rem,5vw,5.15rem)] font-semibold leading-[0.96] tracking-tight">
          <GradientText
            colors={["#eaf2ff", "#8db7ff", "#2f6fed", "#dbeafe"]}
            animationSpeed={9}
            direction="horizontal"
            className="text-center"
          >
            Hey there, I&apos;m Aziz
          </GradientText>
        </h1>
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
      </div>
    </section>
  );
}

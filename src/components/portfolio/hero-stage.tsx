"use client";

import Link from "next/link";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import Aurora from "@/components/Aurora";
import Magnet from "@/components/Magnet";
import SplitText from "@/components/SplitText";
import { Button } from "@/components/ui/button";
import { navItems } from "@/data/profile";

type HeroStageProps = {
  name: string;
  role: string;
  summary: string;
  resumeHref: string;
  proofPoints: string[];
};

export function HeroStage({
  role,
  summary,
  resumeHref,
  proofPoints,
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

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-[#eaf2ff]/10 bg-[#0b1f3a]/72 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <Link href="/" className="font-mono text-xs uppercase tracking-[0.24em] text-[#eaf2ff]">
          Aziz Umarov
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.slice(1).map((item) => (
            <Button
              key={item.href}
              render={<Link href={item.href} />}
              variant="ghost"
              size="sm"
              className="rounded-full text-[#eaf2ff]/72 hover:bg-[#eaf2ff]/8 hover:text-[#eaf2ff]"
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button
          render={<Link href={resumeHref} target="_blank" rel="noreferrer" />}
          size="sm"
          className="rounded-full bg-[#2f6fed] px-4 text-[#eaf2ff] hover:bg-[#255ed2]"
        >
          Resume
          <FileTextIcon data-icon="inline-end" />
        </Button>
      </nav>

      <div className="mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-14 py-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.72fr)] lg:py-24">
        <div className="max-w-6xl">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-[#eaf2ff]/62">
            {role}
          </p>
          <h1 className="max-w-6xl text-[clamp(3rem,7.2vw,6.8rem)] font-semibold leading-[0.9] tracking-tight text-[#eaf2ff]">
            <SplitText
              text="Aziz Umarov"
              tag="span"
              splitType="words"
              textAlign="left"
              className="block text-[#eaf2ff]"
              delay={70}
              from={{ opacity: 0.08, y: 34, rotateX: -22 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
            />
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#eaf2ff]/76 md:text-xl">
            {summary}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnet padding={54} magnetStrength={7}>
              <Button
                render={<Link href="/projects" />}
                size="lg"
                className="h-12 rounded-full bg-[#2f6fed] px-6 text-[#eaf2ff] shadow-[0_14px_38px_rgba(47,111,237,0.24)] hover:bg-[#255ed2]"
              >
                View projects
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </Magnet>
            <Magnet padding={54} magnetStrength={7}>
              <Button
                render={<Link href={resumeHref} target="_blank" rel="noreferrer" />}
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-[#eaf2ff]/16 bg-[#eaf2ff]/7 px-6 text-[#eaf2ff] hover:bg-[#eaf2ff]/12"
              >
                Resume
              </Button>
            </Magnet>
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-md lg:ml-auto">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#eaf2ff]/10 bg-[#0b1f3a]/66 p-3 shadow-[0_32px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[radial-gradient(circle_at_50%_22%,rgba(47,111,237,0.42),transparent_15rem),linear-gradient(145deg,#061427,#0b1f3a_58%,#123e7a)]">
              <div className="absolute inset-8 rounded-[1.25rem] border border-[#eaf2ff]/10" />
              <div className="absolute inset-x-8 top-10 h-px bg-[#eaf2ff]/16" />
              <div className="absolute inset-y-10 left-10 w-px bg-[#eaf2ff]/10" />
              <div className="absolute inset-y-10 right-10 w-px bg-[#eaf2ff]/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 text-[clamp(4.8rem,10vw,7.2rem)] font-semibold leading-none tracking-normal text-[#eaf2ff]">
                  <span className="translate-y-8 opacity-45">J</span>
                  <span className="opacity-90">J</span>
                  <span className="-translate-y-8 opacity-62">J</span>
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-[#eaf2ff]/10 bg-[#061427]/68 px-4 py-3 backdrop-blur-md">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#eaf2ff]/62">
                  3J model stage
                </p>
              </div>
            </div>
          </div>
          <div className="relative -mt-8 ml-3 w-[min(24rem,92vw)] rounded-2xl border border-[#eaf2ff]/12 bg-[#0b1f3a] p-5 text-[#eaf2ff] shadow-[0_22px_80px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#eaf2ff]/56">
                Profile
              </p>
              <span className="h-2 w-2 rounded-full bg-[#2f6fed]" />
            </div>
            <div className="grid gap-2">
              {proofPoints.map((point) => (
                <p key={point} className="text-sm leading-6 text-[#eaf2ff]/78">
                  {point}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

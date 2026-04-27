"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import Aurora from "@/components/Aurora";
import Magnet from "@/components/Magnet";
import SplitText from "@/components/SplitText";
import { LiquidPillNav } from "@/components/portfolio/liquid-pill-nav";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

export function HomeModelStage() {
  return (
    <main className="relative isolate min-h-dvh w-full overflow-hidden bg-deep-navy px-5 py-8 text-ice sm:px-8 lg:px-10">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_50%_8%,rgba(141,183,255,0.14),transparent_28rem),linear-gradient(180deg,#061427_0%,#081a31_48%,#061427_100%)]" />
      <div className="absolute inset-x-[-18%] top-[-16%] -z-20 h-[84dvh] opacity-68 saturate-125">
        <Aurora
          colorStops={["#061427", "#2f6fed", "#8db7ff"]}
          amplitude={0.4}
          blend={0.76}
          speed={0.32}
        />
      </div>
      <div className="absolute inset-x-[10%] bottom-[-18%] -z-20 h-[42dvh] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(47,111,237,0.15),rgba(141,183,255,0.06)_38%,transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_46%,rgba(47,111,237,0.16),transparent_32rem),radial-gradient(circle_at_78%_16%,rgba(219,234,254,0.09),transparent_24rem),linear-gradient(180deg,rgba(6,20,39,0.08)_0%,rgba(6,20,39,0.42)_50%,#061427_100%)]" />

      <div className="relative z-20">
        <LiquidPillNav />
      </div>

      <section className="mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center py-10">
        <div className="relative min-h-[72dvh] overflow-hidden rounded-[2rem] border border-ice/10 bg-navy/28 shadow-[0_40px_140px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(47,111,237,0.26),transparent_24rem)]" />
          <div className="absolute inset-6 rounded-[1.5rem] border border-ice/10" />
          <div className="absolute inset-x-8 top-1/2 h-px bg-ice/10" />
          <div className="absolute inset-y-8 left-1/2 w-px bg-ice/10" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 text-[clamp(6.5rem,17vw,16rem)] font-semibold leading-none tracking-normal text-ice">
              <span className="translate-y-[14%] opacity-42">J</span>
              <span className="opacity-92">J</span>
              <span className="-translate-y-[14%] opacity-58">J</span>
            </div>
          </div>

          <div className="absolute left-5 top-5 max-w-[28rem] sm:left-8 sm:top-8">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-ice/58">
              {profile.role}
            </p>
            <h1 className="mt-5 text-[clamp(2.6rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-tight text-ice">
              <SplitText
                text="Hi, my name is Aziz."
                tag="span"
                splitType="words"
                textAlign="left"
                className="block"
                delay={55}
                from={{ opacity: 0.08, y: 28, rotateX: -18 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
              />
            </h1>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 sm:bottom-8 sm:left-8 sm:right-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-sm text-sm leading-6 text-ice/62">
              3J model stage.
            </p>
            <Magnet padding={46} magnetStrength={6}>
              <Button
                render={<Link href="/projects" />}
                className="h-12 rounded-full bg-cobalt px-6 text-ice shadow-[0_14px_38px_rgba(47,111,237,0.24)] hover:bg-cobalt/85"
              >
                Projects
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </Magnet>
          </div>
        </div>
      </section>
    </main>
  );
}

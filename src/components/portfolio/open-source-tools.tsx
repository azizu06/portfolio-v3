import Link from "next/link";
import { ArrowUpRight, GitFork, Star, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { OpenSourceTool } from "@/data/projects";

type OpenSourceToolsProps = {
  tools: OpenSourceTool[];
};

export function OpenSourceTools({ tools }: OpenSourceToolsProps) {
  return (
    <section aria-labelledby="open-source-tools-heading" className="mt-20 sm:mt-24">
      <h2
        id="open-source-tools-heading"
        className="flex items-center gap-2.5 font-mono text-lg font-black uppercase tracking-[0.08em] text-ice sm:gap-3 sm:text-xl"
      >
        <Wrench className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        Open-source tools
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:gap-6">
        {tools.map((tool) => (
          <li key={tool.name} className="min-w-0">
            <Card className="h-full rounded-[1.1rem] border border-ice/14 bg-navy/86 py-0 text-ice ring-0 transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:border-sky-300/50 hover:-translate-y-0.5 hover:border-sky-300/45 motion-reduce:transform-none motion-reduce:transition-none">
              <CardContent className="flex h-full min-w-0 flex-col gap-4 p-5 sm:p-7">
                <Link
                  href={tool.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/tool inline-flex min-w-0 items-start gap-2 rounded-md font-mono text-base font-black leading-snug tracking-tight text-ice outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:text-xl"
                >
                  <span className="min-w-0 break-words">azizu06/{tool.name}</span>
                  <ArrowUpRight
                    className="mt-0.5 h-5 w-5 shrink-0 text-sky-300 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/tool:-translate-y-0.5 group-hover/tool:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </Link>
                <p className="text-base font-semibold leading-7 tracking-tight text-ice/86 sm:text-lg sm:leading-8">
                  {tool.description}
                </p>
                <p className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm font-bold uppercase tracking-[0.08em] text-ice/70 sm:text-base">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4" aria-hidden="true" />
                    {tool.stars}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GitFork className="h-4 w-4" aria-hidden="true" />
                    {tool.forks}
                  </span>
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

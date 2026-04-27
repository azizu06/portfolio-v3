import Link from "next/link";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ContactSection() {
  return (
    <footer id="contact" className="border-t border-white/10 px-5 py-16 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-lime-200/70">
              Final whistle
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Pass me the next problem worth building.
            </h2>
            <p className="text-white/58">
              I&apos;m interested in software that connects product thinking,
              research context, and careful execution.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.links.slice(0, 3).map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.href}
                  render={
                    <Link href={link.href} target="_blank" rel="noreferrer" />
                  }
                  variant="outline"
                  className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/10"
                >
                  <Icon data-icon="inline-start" />
                  {link.label}
                </Button>
              );
            })}
          </div>
        </div>
        <Separator />
        <p className="text-sm text-white/44">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js,
          Three.js, GSAP, shadcn/ui, Motion, and Vercel.
        </p>
      </div>
    </footer>
  );
}

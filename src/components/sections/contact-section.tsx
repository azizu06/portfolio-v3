import Link from "next/link";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ContactSection() {
  return (
    <footer id="contact" className="border-t px-5 py-16 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Contact
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s build the next version with real context.
            </h2>
            <p className="text-muted-foreground">
              This starter is ready for your updated resume, final project list,
              and any screenshots or deployment links you want to highlight.
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
                >
                  <Icon data-icon="inline-start" />
                  {link.label}
                </Button>
              );
            })}
          </div>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js,
          shadcn/ui, Motion, and Vercel.
        </p>
      </div>
    </footer>
  );
}

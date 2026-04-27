import Link from "next/link";
import { FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems, profile } from "@/data/profile";

export function RouteHeader() {
  return (
    <header className="px-5 pt-6 sm:px-8 lg:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-ice/10 bg-navy/72 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <Link href="/" className="font-mono text-xs uppercase tracking-[0.24em] text-ice">
          Aziz Umarov
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.slice(1).map((item) => (
            <Button
              key={item.href}
              render={<Link href={item.href} />}
              variant="ghost"
              size="sm"
              className="rounded-full text-ice/72 hover:bg-ice/8 hover:text-ice"
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button
          render={<Link href={profile.resumeHref} target="_blank" rel="noreferrer" />}
          size="sm"
          className="rounded-full bg-cobalt px-4 text-ice hover:bg-cobalt/85"
        >
          Resume
          <FileTextIcon data-icon="inline-end" />
        </Button>
      </nav>
    </header>
  );
}

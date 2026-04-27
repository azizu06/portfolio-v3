import Image from "next/image";
import Link from "next/link";
import { navItems, profile } from "@/data/profile";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#home" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded-md"
            priority
          />
          <span className="font-mono text-sm text-muted-foreground">
            azizu.dev
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button render={<Link href={profile.resumeHref} />} size="sm">
          Resume
        </Button>
      </div>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { navItems, profile } from "@/data/profile";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4 sm:px-8">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#07100c]/72 px-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <Link href="#home" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded-full border border-white/15"
            priority
          />
          <span className="font-mono text-sm text-lime-100/70">
            aziz.fc
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-lime-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          render={<Link href={profile.resumeHref} />}
          size="sm"
          className="rounded-full bg-lime-200 text-black hover:bg-lime-100"
        >
          Resume
        </Button>
      </div>
    </header>
  );
}

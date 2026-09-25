import Link from "next/link";
import { QrCode } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-blue-100 bg-[var(--header-bg)] shadow-sm backdrop-blur-sm dark:border-white/10">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-6">
        <Link
          href="/"
          className="group focus-visible:ring-ring/50 flex items-center gap-4 rounded-lg outline-none focus-visible:ring-[3px]"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md transition-transform group-hover:scale-105">
            <QrCode className="size-6" aria-hidden />
          </span>
          <span>
            <span className="block text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {siteConfig.name}
            </span>
            <span className="block text-sm text-slate-600 sm:text-base dark:text-slate-300">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

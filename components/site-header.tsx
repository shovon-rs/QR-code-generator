import Link from "next/link";
import { QrCode, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <>
      <header className="bg-card/90 fixed inset-x-0 top-0 z-40 h-20 border-b shadow-sm backdrop-blur-xl">
        <a
          href="#main-content"
          className="focus:bg-card sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4"
        >
          Skip to content
        </a>
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="QR Code Generator home"
            className="focus-visible:ring-ring flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2"
          >
            <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
              <QrCode className="size-6" aria-hidden />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              QR<span className="text-muted-foreground font-normal"> Studio</span>
            </span>
          </Link>
          <div className="flex items-center gap-5 sm:gap-8">
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-7 text-xs font-medium sm:flex"
            >
              <Link href="/#studio" className="hover:text-primary transition-colors">
                Generator
              </Link>
              <Link href="/#history" className="text-muted-foreground hover:text-primary transition-colors">
                Your collection
              </Link>
            </nav>
            <span className="hidden items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase lg:flex">
              Free to create
              <ArrowUpRight className="size-3" aria-hidden />
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="h-20 shrink-0" aria-hidden="true" />
    </>
  );
}

import Link from "next/link";
import { QrCode } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <>
      <header className="bg-background fixed inset-x-0 top-0 z-40 h-16 border-b">
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
            className="focus-visible:ring-ring flex items-center gap-2 rounded-md outline-none focus-visible:ring-2"
          >
            <QrCode className="text-primary size-6" aria-hidden />
            <span className="text-base font-semibold tracking-tight">QR Studio</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <nav
              aria-label="Main navigation"
              className="text-muted-foreground hidden items-center gap-6 text-sm sm:flex"
            >
              <Link href="/#studio" className="hover:text-primary transition-colors">
                Generator
              </Link>
              <Link href="/#history" className="text-muted-foreground hover:text-primary transition-colors">
                History
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="h-16 shrink-0" aria-hidden="true" />
    </>
  );
}

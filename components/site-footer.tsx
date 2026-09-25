import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border mt-auto border-t bg-[var(--header-bg)] dark:border-white/10">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 text-xs sm:flex-row sm:px-8 lg:px-12">
        <p>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <nav aria-label="Legal" className="flex gap-6">
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary hover:underline">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}

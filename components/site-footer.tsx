import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-blue-100 bg-[var(--header-bg)] dark:border-white/10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row dark:text-slate-300">
        <p>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <nav aria-label="Legal" className="flex gap-6">
          <Link href="/privacy" className="hover:text-blue-700 hover:underline dark:hover:text-blue-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-blue-700 hover:underline dark:hover:text-blue-300">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}

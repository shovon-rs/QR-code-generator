import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="container mx-auto max-w-3xl flex-1 px-4 py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-blue-700 hover:underline dark:text-blue-300"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to generator
        </Link>
        <article className="bg-card space-y-4 rounded-xl border-2 border-blue-100 p-6 leading-relaxed shadow-lg sm:p-8 dark:border-blue-900/50 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="text-muted-foreground text-sm">Last updated: {updated}</p>
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

import { QrApp } from "@/components/qr/qr-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ShieldCheck, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-8 lg:px-12">
        <section className="flex flex-col justify-between gap-6 py-10 sm:py-14 lg:flex-row lg:items-end">
          <div>
            <p className="text-primary mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
              <Sparkles className="size-4" aria-hidden /> A little code. Endless possibilities.
            </p>
            <h1 className="text-4xl leading-[1.08] font-semibold tracking-[-0.055em] sm:text-6xl">
              Make every connection
              <br />
              <span className="text-primary font-serif font-normal italic">beautifully simple.</span>
            </h1>
            <p className="text-muted-foreground mt-5 max-w-lg text-sm leading-7 sm:text-base">
              Turn your link into a QR code that feels like your brand.
              <br className="hidden sm:block" /> Create, customize, and share in seconds.
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-3 pb-1 text-xs">
            <ShieldCheck className="text-primary size-5" aria-hidden />
            <div>
              <p className="text-foreground font-medium">Your links stay yours.</p>
              <p className="mt-1">No sign-up. No tracking. Always free.</p>
            </div>
          </div>
        </section>
        <QrApp />
        <section className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3" aria-label="Features">
          {[
            ["01", "Made for your brand", "Your colors, your logo, your finishing touches."],
            ["02", "Ready for anywhere", "Sharp PNGs and scalable SVGs, from screen to print."],
            ["03", "Private by design", "Created on your device. Saved in your browser."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-4">
              <span className="text-primary pt-1 font-mono text-xs">{number}</span>
              <div>
                <h2 className="text-sm font-medium">{title}</h2>
                <p className="text-muted-foreground mt-2 text-xs leading-6">{description}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

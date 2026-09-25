import { QrApp } from "@/components/qr/qr-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 pt-8 pb-16 sm:px-8 lg:px-12">
        <h1 className="sr-only">{siteConfig.name}</h1>
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

import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for using ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="September 25, 2026">
      <p>By using {siteConfig.name} you agree to these terms.</p>
      <h2>Use of the service</h2>
      <ul>
        <li>The generator is free for personal and commercial use.</li>
        <li>
          You are responsible for the links you encode. Don&apos;t use the service to point people to
          unlawful, deceptive or harmful content.
        </li>
        <li>You must have the rights to any logo or image you add to a QR code.</li>
      </ul>
      <h2>No warranty</h2>
      <p>
        The service is provided &quot;as is&quot;. Always test a QR code with more than one scanner before
        printing or publishing it. Custom colors, small sizes and logos can make codes harder to read.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for losses arising from the use of generated QR
        codes, including misprints or unreadable codes.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms. Continued use after changes means you accept the new terms.</p>
      <h2>Contact</h2>
      <p>
        Email{" "}
        <a className="text-blue-700 underline dark:text-blue-300" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}

import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 25, 2026">
      <p>
        {siteConfig.name} is built to work without collecting your personal data. This page explains what
        happens to the information you enter.
      </p>
      <h2>QR codes are generated in your browser</h2>
      <p>
        The links you enter and any logo you upload are processed entirely on your device. They are not sent
        to or stored on our servers.
      </p>
      <h2>Local history</h2>
      <p>
        Your recent QR codes and customization preferences are saved in your browser&apos;s local storage so
        they&apos;re still there next time. You can delete individual items or clear the whole history at any
        time. Clearing your browser data also removes them.
      </p>
      <h2>Analytics</h2>
      <p>
        We may use privacy-friendly, cookie-less analytics to count page views and measure performance. These
        do not include the links you turn into QR codes.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email{" "}
        <a className="text-blue-700 underline dark:text-blue-300" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}

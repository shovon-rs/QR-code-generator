export const siteConfig = {
  name: "QR Code Generator",
  tagline: "Generate QR codes from URLs instantly",
  description:
    "Turn any link into a scannable QR code in your browser. Customize colors and logo, download PNG or SVG, and keep your history — free, no sign-up.",
  // Override per environment, e.g. NEXT_PUBLIC_SITE_URL=https://qrcode.rldhaka.com
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "dev@redlimesolutions.com",
} as const;

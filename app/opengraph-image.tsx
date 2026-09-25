import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eef2ff 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
          color: "white",
          fontSize: 72,
          fontWeight: 700,
        }}
      >
        QR
      </div>
      <div style={{ fontSize: 72, fontWeight: 700, color: "#0f172a" }}>{siteConfig.name}</div>
      <div style={{ fontSize: 34, color: "#475569" }}>{siteConfig.tagline}</div>
    </div>,
    size,
  );
}

import type { Options as StylingOptions } from "qr-code-styling";
import type { ImageFormat, QrOptions } from "@/types/qr";

export const DEFAULT_QR_OPTIONS: QrOptions = {
  size: 512,
  margin: 16,
  fgColor: "#000000",
  bgColor: "#ffffff",
  errorCorrection: "M",
  dotStyle: "square",
  cornerStyle: "square",
};

export const SIZE_RANGE = { min: 256, max: 1024, step: 64 } as const;
export const MARGIN_RANGE = { min: 0, max: 48, step: 4 } as const;

/** Maps our app-level options onto qr-code-styling's option shape. */
export function toStylingOptions(data: string, opts: QrOptions): StylingOptions {
  const hasLogo = Boolean(opts.logoDataUrl);
  return {
    type: "svg",
    width: opts.size,
    height: opts.size,
    margin: opts.margin,
    data,
    image: opts.logoDataUrl,
    qrOptions: {
      // A logo covers modules, so we need the highest recovery level.
      errorCorrectionLevel: hasLogo ? "H" : opts.errorCorrection,
    },
    imageOptions: {
      saveAsBlob: true, // embed the logo as a data URL so exports are self-contained
      hideBackgroundDots: true,
      imageSize: 0.3,
      margin: 4,
      crossOrigin: "anonymous",
    },
    dotsOptions: { type: opts.dotStyle, color: opts.fgColor },
    cornersSquareOptions: { type: opts.cornerStyle, color: opts.fgColor },
    cornersDotOptions: {
      type: opts.cornerStyle === "extra-rounded" ? "dot" : opts.cornerStyle,
      color: opts.fgColor,
    },
    backgroundOptions: { color: opts.bgColor },
  };
}

/**
 * Renders a QR code to SVG markup, entirely in the browser.
 * qr-code-styling touches `window`, so it is imported lazily (never on the server).
 */
export async function generateQrSvg(data: string, opts: QrOptions): Promise<string> {
  const { default: QRCodeStyling } = await import("qr-code-styling");
  const qr = new QRCodeStyling(toStylingOptions(data, opts));
  const raw = await qr.getRawData("svg");
  if (!raw) throw new Error("QR code generation returned no data");
  const svg = raw instanceof Blob ? await raw.text() : raw.toString("utf-8");
  return svg;
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load QR image"));
    img.src = src;
  });
}

/** Rasterises SVG markup to a PNG blob of `size`×`size` pixels. */
export async function svgToPngBlob(svg: string, size: number): Promise<Blob> {
  const img = await loadImage(svgToDataUrl(svg));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, size, size);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed"))), "image/png");
  });
}

export function svgToBlob(svg: string): Blob {
  return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
}

/** Triggers a real file download (same-origin blob URL, so `download` is honoured). */
export function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** `qr-example.com-20260925-1110.png` */
export function buildFilename(url: string, ext: ImageFormat, date: Date = new Date()): string {
  let host = "code";
  try {
    host = new URL(url).hostname.replace(/^www\./, "") || host;
  } catch {
    /* keep fallback */
  }
  const safeHost = host.replace(/[^a-z0-9.-]/gi, "-").slice(0, 60);
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}`;
  return `qr-${safeHost}-${stamp}.${ext}`;
}

export async function downloadQr(
  svg: string,
  url: string,
  format: ImageFormat,
  size: number,
): Promise<string> {
  const filename = buildFilename(url, format);
  const blob = format === "svg" ? svgToBlob(svg) : await svgToPngBlob(svg, size);
  downloadBlob(blob, filename);
  return filename;
}

export async function copyQrImage(svg: string, size: number): Promise<void> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    throw new Error("Copying images isn't supported in this browser");
  }
  // Passing a promise keeps Safari happy (clipboard access must start in the user gesture).
  await navigator.clipboard.write([new ClipboardItem({ "image/png": svgToPngBlob(svg, size) })]);
}

/* ---------- Colour contrast helpers (scannability warning) ---------- */

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const a = hexToRgb(fg);
  const b = hexToRgb(bg);
  if (!a || !b) return 21;
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export type ScanWarning = "low-contrast" | "inverted" | null;

/** Many scanners expect dark modules on a light background with decent contrast. */
export function getScanWarning(fg: string, bg: string): ScanWarning {
  const a = hexToRgb(fg);
  const b = hexToRgb(bg);
  if (!a || !b) return null;
  if (contrastRatio(fg, bg) < 4) return "low-contrast";
  if (relativeLuminance(a) > relativeLuminance(b)) return "inverted";
  return null;
}

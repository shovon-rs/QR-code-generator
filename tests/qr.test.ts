import { describe, expect, it } from "vitest";

import {
  DEFAULT_QR_OPTIONS,
  buildFilename,
  contrastRatio,
  getScanWarning,
  hexToRgb,
  toStylingOptions,
} from "@/lib/qr";

describe("buildFilename", () => {
  const date = new Date(2026, 8, 25, 11, 10);

  it("uses the hostname and a timestamp", () => {
    expect(buildFilename("https://www.example.com/path", "png", date)).toBe(
      "qr-example.com-20260925-1110.png",
    );
  });

  it("falls back for invalid URLs", () => {
    expect(buildFilename("nope", "svg", date)).toBe("qr-code-20260925-1110.svg");
  });
});

describe("colour helpers", () => {
  it("parses 3 and 6 digit hex", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(hexToRgb("#2563eb")).toEqual([37, 99, 235]);
    expect(hexToRgb("blue")).toBeNull();
  });

  it("computes WCAG contrast", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
  });

  it("warns on low contrast and inverted colours", () => {
    expect(getScanWarning("#000000", "#ffffff")).toBeNull();
    expect(getScanWarning("#cccccc", "#ffffff")).toBe("low-contrast");
    expect(getScanWarning("#ffffff", "#000000")).toBe("inverted");
  });
});

describe("toStylingOptions", () => {
  it("maps app options", () => {
    const o = toStylingOptions("https://example.com", DEFAULT_QR_OPTIONS);
    expect(o.type).toBe("svg");
    expect(o.width).toBe(512);
    expect(o.qrOptions?.errorCorrectionLevel).toBe("M");
    expect(o.dotsOptions?.color).toBe("#000000");
  });

  it("forces error correction H when a logo is present", () => {
    const o = toStylingOptions("x", { ...DEFAULT_QR_OPTIONS, errorCorrection: "L", logoDataUrl: "data:," });
    expect(o.qrOptions?.errorCorrectionLevel).toBe("H");
  });
});

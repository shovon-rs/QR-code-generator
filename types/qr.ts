export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type DotStyle = "square" | "rounded" | "dots" | "classy" | "extra-rounded";
export type CornerStyle = "square" | "extra-rounded" | "dot";

export type QrOptions = {
  /** Export size in px (preview is always rendered at a fixed size). */
  size: number;
  /** Quiet zone in px. */
  margin: number;
  fgColor: string;
  bgColor: string;
  errorCorrection: ErrorCorrectionLevel;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  /** Optional centre logo as a data URL. Forces error correction "H". */
  logoDataUrl?: string;
};

export type QrItem = {
  id: string;
  url: string;
  /** Rendered SVG markup — lets history thumbnails and re-downloads work offline. */
  svg: string;
  options: QrOptions;
  /** ISO timestamp. */
  createdAt: string;
};

export type ImageFormat = "png" | "svg";

import { z } from "zod";

export const MAX_URL_LENGTH = 2048;

/** Adds `https://` when the user typed something like `example.com`. */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) return trimmed; // already has a scheme
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    // Require a plausible host: "localhost" or something with a dot.
    return url.hostname === "localhost" || url.hostname.includes(".");
  } catch {
    return false;
  }
}

export const urlFormSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Please enter a URL to generate a QR code.")
    .max(MAX_URL_LENGTH, `URLs must be ${MAX_URL_LENGTH} characters or fewer.`)
    .transform(normalizeUrl)
    .refine(isHttpUrl, "Please enter a valid URL (e.g., https://example.com)."),
});

export type UrlFormInput = z.input<typeof urlFormSchema>;
export type UrlFormOutput = z.output<typeof urlFormSchema>;

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const MAX_LOGO_DIMENSION = 256;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates an uploaded logo and downsizes it to ≤256px PNG so it stays small
 * enough to embed in the SVG and keep in localStorage.
 */
export async function fileToLogoDataUrl(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Please choose a PNG, JPG, WebP or SVG image.");
  if (file.size > MAX_LOGO_BYTES) throw new Error("Images must be 2MB or smaller.");

  const src = await readAsDataUrl(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("That file doesn't look like a valid image."));
    el.src = src;
  });

  const w = img.naturalWidth || MAX_LOGO_DIMENSION;
  const h = img.naturalHeight || MAX_LOGO_DIMENSION;
  const scale = Math.min(1, MAX_LOGO_DIMENSION / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

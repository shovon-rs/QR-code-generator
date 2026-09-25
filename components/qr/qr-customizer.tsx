"use client";

import { AlertTriangle, ImagePlus, Palette, RotateCcw, X } from "lucide-react";
import { useId, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MARGIN_RANGE, SIZE_RANGE, getScanWarning } from "@/lib/qr";
import { fileToLogoDataUrl, MAX_LOGO_BYTES } from "@/lib/logo";
import { useSettingsStore } from "@/store/settings-store";
import type { CornerStyle, DotStyle, ErrorCorrectionLevel } from "@/types/qr";

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Extra rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
];

const CORNER_STYLES: { value: CornerStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Rounded" },
  { value: "dot", label: "Circle" },
];

const ECC_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-input h-9 w-12 shrink-0 cursor-pointer rounded-md border bg-transparent p-1"
        />
        <Input
          aria-label={`${label} hex value`}
          value={value}
          maxLength={7}
          spellCheck={false}
          className="font-mono uppercase"
          onChange={(e) => {
            const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
            if (/^#[\da-f]{0,6}$/i.test(v)) onChange(v.length === 7 ? v.toLowerCase() : v);
          }}
          onBlur={(e) => {
            if (!/^#[\da-f]{6}$/i.test(e.target.value)) onChange(value.length === 7 ? value : "#000000");
          }}
        />
      </div>
    </div>
  );
}

export function QrCustomizer() {
  const options = useSettingsStore((s) => s.options);
  const setOptions = useSettingsStore((s) => s.setOptions);
  const reset = useSettingsStore((s) => s.reset);
  const fileRef = useRef<HTMLInputElement>(null);
  const ids = { dots: useId(), corners: useId(), ecc: useId(), logo: useId() };

  const isValidHex = (c: string) => /^#[\da-f]{6}$/i.test(c);
  const warning =
    isValidHex(options.fgColor) && isValidHex(options.bgColor)
      ? getScanWarning(options.fgColor, options.bgColor)
      : null;

  const onLogoChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      setOptions({ logoDataUrl: dataUrl });
      toast.success("Logo added", { description: "Error correction set to High so it still scans." });
    } catch (err) {
      toast.error("Couldn't use that image", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Card className="border-2 border-blue-100 shadow-lg dark:border-blue-900/50">
      <CardHeader className="bg-tint-blue py-4">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Palette className="size-5 text-blue-600 dark:text-blue-400" aria-hidden />
          <h2>Customize</h2>
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Changes apply live to the current QR code and to new ones.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset customization">
            <RotateCcw aria-hidden />
            Reset
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField
            label="Foreground"
            value={options.fgColor}
            onChange={(fgColor) => setOptions({ fgColor })}
          />
          <ColorField
            label="Background"
            value={options.bgColor}
            onChange={(bgColor) => setOptions({ bgColor })}
          />
        </div>

        {warning && (
          <p
            role="status"
            className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {warning === "low-contrast"
              ? "Low contrast between colors — some scanners may fail to read this code."
              : "Light code on a dark background isn't supported by every scanner. Test before printing."}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Export size</span>
              <span className="text-muted-foreground text-sm tabular-nums">{options.size}px</span>
            </div>
            <Slider
              aria-label="Export size"
              min={SIZE_RANGE.min}
              max={SIZE_RANGE.max}
              step={SIZE_RANGE.step}
              value={[options.size]}
              onValueChange={([size]) => setOptions({ size })}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Margin</span>
              <span className="text-muted-foreground text-sm tabular-nums">{options.margin}px</span>
            </div>
            <Slider
              aria-label="Margin"
              min={MARGIN_RANGE.min}
              max={MARGIN_RANGE.max}
              step={MARGIN_RANGE.step}
              value={[options.margin]}
              onValueChange={([margin]) => setOptions({ margin })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={ids.dots}>Dot style</Label>
            <Select value={options.dotStyle} onValueChange={(v) => setOptions({ dotStyle: v as DotStyle })}>
              <SelectTrigger id={ids.dots}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOT_STYLES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={ids.corners}>Corners</Label>
            <Select
              value={options.cornerStyle}
              onValueChange={(v) => setOptions({ cornerStyle: v as CornerStyle })}
            >
              <SelectTrigger id={ids.corners}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CORNER_STYLES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={ids.ecc}>Error correction</Label>
            <Select
              value={options.logoDataUrl ? "H" : options.errorCorrection}
              disabled={Boolean(options.logoDataUrl)}
              onValueChange={(v) => setOptions({ errorCorrection: v as ErrorCorrectionLevel })}
            >
              <SelectTrigger id={ids.ecc}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ECC_LEVELS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={ids.logo}>Center logo (optional)</Label>
          <div className="flex items-center gap-3">
            {options.logoDataUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
                <img
                  src={options.logoDataUrl}
                  alt="Selected logo"
                  className="size-10 rounded-md border bg-white object-contain p-1"
                />
                <Button variant="outline" size="sm" onClick={() => setOptions({ logoDataUrl: undefined })}>
                  <X aria-hidden />
                  Remove logo
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <ImagePlus aria-hidden />
                Upload image
              </Button>
            )}
            <input
              ref={fileRef}
              id={ids.logo}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="sr-only"
              onChange={(e) => onLogoChange(e.target.files?.[0])}
            />
            <span className="text-muted-foreground text-xs">
              PNG, JPG, WebP or SVG · max {Math.round(MAX_LOGO_BYTES / 1024 / 1024)}MB
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

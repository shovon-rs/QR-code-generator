"use client";

import { Check, Copy, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadMenu } from "@/components/qr/download-menu";
import { copyQrImage, svgToDataUrl } from "@/lib/qr";
import type { QrItem } from "@/types/qr";

export function QrResultCard({ item }: { item: QrItem }) {
  const [copied, setCopied] = useState<"image" | "link" | null>(null);

  const flash = (kind: "image" | "link") => {
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyImage = async () => {
    try {
      await copyQrImage(item.svg, item.options.size);
      flash("image");
      toast.success("Image copied to clipboard");
    } catch (err) {
      toast.error("Couldn't copy image", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      flash("link");
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <Card className="studio-panel" aria-live="polite" data-testid="qr-result">
      <CardHeader className="pb-1">
        <CardTitle className="text-foreground">
          <h2>Generated QR Code</h2>
        </CardTitle>
        <CardDescription className="text-muted-foreground break-all">
          Scan this QR code to visit:{" "}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            {item.url}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="preview-stage flex min-h-72 items-center justify-center rounded-xl border py-6">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL, nothing to optimise */}
            <img
              src={svgToDataUrl(item.svg)}
              alt={`QR code for ${item.url}`}
              width={192}
              height={192}
              className="size-48 object-contain"
            />
          </div>
        </div>
        <DownloadMenu item={item} />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={copyImage}>
            {copied === "image" ? <Check aria-hidden /> : <Copy aria-hidden />}
            Copy image
          </Button>
          <Button variant="outline" onClick={copyLink}>
            {copied === "link" ? <Check aria-hidden /> : <Link2 aria-hidden />}
            Copy link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

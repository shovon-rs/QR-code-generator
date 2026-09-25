"use client";

import { ChevronDown, Download, FileCode2, FileImage } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadQr } from "@/lib/qr";
import type { ImageFormat, QrItem } from "@/types/qr";

export async function handleDownload(item: QrItem, format: ImageFormat) {
  try {
    const filename = await downloadQr(item.svg, item.url, format, item.options.size);
    toast.success("Download Started", { description: filename });
  } catch (err) {
    console.error("Error downloading QR code:", err);
    toast.error("Download Failed", {
      description: "Failed to download QR code. Please try again.",
    });
  }
}

export function DownloadMenu({ item }: { item: QrItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="w-full border border-sky-200 bg-sky-100 font-medium text-sky-800 hover:bg-sky-200 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200 dark:hover:bg-sky-900"
        >
          <Download aria-hidden />
          Download QR Code
          <ChevronDown className="opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>
          {item.options.size}×{item.options.size}px
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => handleDownload(item, "png")}>
          <FileImage aria-hidden />
          PNG image
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleDownload(item, "svg")}>
          <FileCode2 aria-hidden />
          SVG vector
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Download, ExternalLink, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { handleDownload } from "@/components/qr/download-menu";
import { cn, formatDate } from "@/lib/utils";
import { svgToDataUrl } from "@/lib/qr";
import type { QrItem } from "@/types/qr";

type Props = {
  item: QrItem;
  selected: boolean;
  onSelect: (item: QrItem) => void;
  onDelete: (item: QrItem) => void;
};

function IconAction({
  label,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label={label} className={className} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function QrHistoryItem({ item, selected, onSelect, onDelete }: Props) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl border-2 bg-gradient-to-r from-slate-50 to-blue-50/60 p-3 transition-colors sm:gap-4 sm:p-4 dark:from-slate-900/60 dark:to-blue-950/40",
        selected
          ? "border-blue-400 dark:border-blue-500"
          : "border-blue-100 hover:border-blue-200 dark:border-white/10 dark:hover:border-white/20",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-pressed={selected}
        aria-label={`Show QR code for ${item.url}`}
        className="focus-visible:ring-ring/50 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-[3px] sm:gap-4"
      >
        <span className="shrink-0 rounded-lg border bg-white p-1.5 shadow-sm dark:border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL thumbnail */}
          <img src={svgToDataUrl(item.svg)} alt="" width={48} height={48} className="size-12" />
        </span>
        <span className="min-w-0">
          <span
            className="block truncate text-sm font-medium text-slate-900 dark:text-slate-100"
            title={item.url}
          >
            {item.url}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Generated <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
          </span>
        </span>
      </button>
      <div className="flex shrink-0 gap-1.5">
        <IconAction label="Open link" asChild>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden />
          </a>
        </IconAction>
        <IconAction
          label="Download PNG"
          className="bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:hover:bg-violet-900"
          onClick={() => handleDownload(item, "png")}
        >
          <Download aria-hidden />
        </IconAction>
        <IconAction
          label="Delete"
          className="hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(item)}
        >
          <Trash2 aria-hidden />
        </IconAction>
      </div>
    </li>
  );
}

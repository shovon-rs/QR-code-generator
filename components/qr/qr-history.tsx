"use client";

import { History, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QrHistoryItem } from "@/components/qr/qr-history-item";
import type { QrItem } from "@/types/qr";

type Props = {
  items: QrItem[];
  hydrated: boolean;
  selectedId?: string;
  onSelect: (item: QrItem) => void;
  onDelete: (item: QrItem) => void;
  onClear: () => void;
};

export function QrHistory({ items, hydrated, selectedId, onSelect, onDelete, onClear }: Props) {
  const count = items.length;

  return (
    <Card className="studio-panel" data-testid="qr-history">
      <CardHeader className="pb-1">
        <CardTitle className="text-foreground flex items-center gap-2">
          <History className="text-primary size-5" aria-hidden />
          <h2>QR Code History</h2>
        </CardTitle>
        <CardDescription className="text-muted-foreground" aria-live="polite">
          {count === 0
            ? "Your generated QR codes will appear here."
            : `${count} QR code${count === 1 ? "" : "s"} generated`}
        </CardDescription>
        {count > 0 && (
          <CardAction>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Trash2 aria-hidden />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes all {count} saved QR code{count === 1 ? "" : "s"} from this browser. This
                    can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClear}>Clear history</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {!hydrated ? (
          <div className="flex justify-center py-12" aria-label="Loading history">
            <Loader2 className="text-primary size-6 animate-spin" aria-hidden />
          </div>
        ) : count === 0 ? (
          <div className="bg-background/60 flex flex-col items-center gap-3 rounded-xl border border-dashed py-8 text-center">
            <span className="bg-secondary text-primary flex size-12 items-center justify-center rounded-full">
              <History className="size-6" aria-hidden />
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No QR codes generated yet. Create your first one above!
            </p>
          </div>
        ) : (
          <ul className="max-h-[36rem] space-y-3 overflow-y-auto pr-1" aria-label="Generated QR codes">
            {items.map((item) => (
              <QrHistoryItem
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

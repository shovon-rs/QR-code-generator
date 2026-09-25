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
    <Card className="border-2 border-violet-100 shadow-lg dark:border-violet-900/50" data-testid="qr-history">
      <CardHeader className="bg-tint-violet py-4">
        <CardTitle className="flex items-center gap-2 text-violet-900 dark:text-violet-100">
          <History className="size-5 text-violet-600 dark:text-violet-400" aria-hidden />
          <h2>QR Code History</h2>
        </CardTitle>
        <CardDescription className="text-violet-700 dark:text-violet-300" aria-live="polite">
          {count === 0
            ? "Your generated QR codes will appear here."
            : `${count} QR code${count === 1 ? "" : "s"} generated`}
        </CardDescription>
        {count > 0 && (
          <CardAction>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-violet-800 dark:text-violet-200">
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
            <Loader2 className="size-6 animate-spin text-violet-500" aria-hidden />
          </div>
        ) : count === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
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

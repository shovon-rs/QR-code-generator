"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QrCode, ScanLine, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { QrCustomizer } from "@/components/qr/qr-customizer";
import { QrGeneratorForm } from "@/components/qr/qr-generator-form";
import { QrHistory } from "@/components/qr/qr-history";
import { QrResultCard } from "@/components/qr/qr-result-card";
import { generateQrSvg } from "@/lib/qr";
import { useHistoryStore } from "@/store/history-store";
import { useSettingsStore } from "@/store/settings-store";
import type { QrItem } from "@/types/qr";

export function QrApp() {
  const [hydrated, setHydrated] = useState(false);
  const [current, setCurrent] = useState<QrItem | null>(null);

  const options = useSettingsStore((s) => s.options);
  const items = useHistoryStore((s) => s.items);
  const addItem = useHistoryStore((s) => s.add);
  const updateItem = useHistoryStore((s) => s.update);
  const removeItem = useHistoryStore((s) => s.remove);
  const clearItems = useHistoryStore((s) => s.clear);

  // Persisted stores use skipHydration; load them only on the client after mount.
  useEffect(() => {
    Promise.all([useHistoryStore.persist.rehydrate(), useSettingsStore.persist.rehydrate()]).finally(() =>
      setHydrated(true),
    );
  }, []);

  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // Live restyle: when the customization changes, re-render the QR code on screen.
  // Keyed on `options` only, so picking an item from history shows it exactly as saved.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const target = currentRef.current;
    if (!target) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const svg = await generateQrSvg(target.url, options);
        if (cancelled) return;
        const next = { ...target, svg, options };
        setCurrent(next);
        updateItem(target.id, { svg, options });
      } catch (err) {
        console.error("Error re-styling QR code:", err);
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [options, updateItem]);

  const handleGenerate = useCallback(
    async (url: string) => {
      const svg = await generateQrSvg(url, options);
      const item: QrItem = {
        id: crypto.randomUUID(),
        url,
        svg,
        options,
        createdAt: new Date().toISOString(),
      };
      setCurrent(item);
      addItem(item);
      toast.success("QR Code Generated", {
        description: "Your QR code has been generated successfully!",
      });
    },
    [options, addItem],
  );

  const handleDelete = useCallback(
    (item: QrItem) => {
      const index = useHistoryStore.getState().items.findIndex((i) => i.id === item.id);
      removeItem(item.id);
      if (currentRef.current?.id === item.id) setCurrent(null);
      toast("QR code deleted", {
        description: item.url,
        action: {
          label: "Undo",
          onClick: () =>
            useHistoryStore.setState((s) => {
              const next = [...s.items];
              next.splice(Math.max(0, index), 0, item);
              return { items: next };
            }),
        },
      });
    },
    [removeItem],
  );

  const handleClear = useCallback(() => {
    clearItems();
    setCurrent(null);
    toast.success("History cleared");
  }, [clearItems]);

  return (
    <div id="studio" className="scroll-mt-28 space-y-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase">Your creative workspace</p>
        <span className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="bg-primary size-1.5 rounded-full" /> All changes saved locally
        </span>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <QrGeneratorForm onGenerate={handleGenerate} />
          <QrCustomizer />
        </div>
        <div className="space-y-4 lg:sticky lg:top-28">
          {current ? (
            <QrResultCard item={current} />
          ) : (
            <section
              className="studio-panel bg-card overflow-hidden rounded-2xl border p-6 sm:p-8"
              aria-label="QR code preview"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Your QR code</h2>
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[10px] font-medium tracking-wider uppercase">
                  Preview
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">A new connection starts here.</p>
              <div className="preview-stage my-7 flex min-h-72 items-center justify-center rounded-xl border">
                <div className="preview-placeholder bg-card relative flex size-48 items-center justify-center rounded-2xl border shadow-xl shadow-black/5">
                  <QrCode className="text-foreground/15 size-32" strokeWidth={1} aria-hidden />
                  <span className="bg-primary text-primary-foreground absolute flex size-12 items-center justify-center rounded-xl shadow-lg">
                    <ScanLine className="size-6" aria-hidden />
                  </span>
                </div>
              </div>
              <p className="text-center text-sm font-medium">Ready when you are</p>
              <p className="text-muted-foreground mx-auto mt-2 max-w-64 text-center text-xs leading-6">
                Enter your URL and generate a code.
                <br />
                Your finished design will appear right here.
              </p>
              <div className="mt-7 flex justify-center gap-2 border-t pt-5">
                {["PNG & SVG", "High resolution", "No watermark"].map((label) => (
                  <span
                    key={label}
                    className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-[10px]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </section>
          )}
          <p className="text-muted-foreground flex items-center justify-center gap-2 text-[11px]">
            <LockKeyhole className="size-3" aria-hidden /> Generated privately, right in your browser
          </p>
        </div>
      </div>
      <div id="history" className="scroll-mt-28">
        <QrHistory
          items={items}
          hydrated={hydrated}
          selectedId={current?.id}
          onSelect={setCurrent}
          onDelete={handleDelete}
          onClear={handleClear}
        />
      </div>
    </div>
  );
}

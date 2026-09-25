"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 [&>*]:min-w-0">
      <div className="space-y-6">
        <QrGeneratorForm onGenerate={handleGenerate} />
        {current && <QrResultCard item={current} />}
        <QrCustomizer />
      </div>
      <div className="lg:sticky lg:top-6">
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

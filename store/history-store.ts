import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { QrItem } from "@/types/qr";
import { safeLocalStorage } from "@/lib/safe-storage";

export const MAX_HISTORY = 50;

type HistoryState = {
  items: QrItem[];
  add: (item: QrItem) => void;
  update: (id: string, patch: Partial<Omit<QrItem, "id">>) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => ({ items: [item, ...s.items.filter((i) => i.id !== item.id)].slice(0, MAX_HISTORY) })),
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "qr-history",
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      // Rehydrated manually after mount to avoid SSR/client hydration mismatches.
      skipHydration: true,
      // The logo is already embedded in each item's SVG, so drop the duplicate data URL.
      partialize: (s) => ({
        items: s.items.map((i) => ({ ...i, options: { ...i.options, logoDataUrl: undefined } })),
      }),
    },
  ),
);

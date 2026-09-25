import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_QR_OPTIONS } from "@/lib/qr";
import { safeLocalStorage } from "@/lib/safe-storage";
import type { QrOptions } from "@/types/qr";

type SettingsState = {
  options: QrOptions;
  setOptions: (patch: Partial<QrOptions>) => void;
  reset: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      options: DEFAULT_QR_OPTIONS,
      setOptions: (patch) => set((s) => ({ options: { ...s.options, ...patch } })),
      reset: () => set({ options: DEFAULT_QR_OPTIONS }),
    }),
    {
      name: "qr-settings",
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      skipHydration: true,
      // Logos can be large; don't persist them between visits.
      partialize: (s) => ({ options: { ...s.options, logoDataUrl: undefined } }),
      merge: (persisted, current) => ({
        ...current,
        options: { ...DEFAULT_QR_OPTIONS, ...(persisted as Partial<SettingsState>)?.options },
      }),
    },
  ),
);

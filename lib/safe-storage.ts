import type { StateStorage } from "zustand/middleware";

function isQuotaError(err: unknown) {
  return (
    err instanceof DOMException &&
    (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

/**
 * localStorage wrapper that never throws. When the quota is exceeded it keeps
 * trimming the oldest half of `state.items` (if present) until the write fits.
 */
export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    let next = value;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        localStorage.setItem(name, next);
        return;
      } catch (err) {
        if (!isQuotaError(err)) return;
        try {
          const parsed = JSON.parse(next);
          const items = parsed?.state?.items;
          if (!Array.isArray(items) || items.length <= 1) return;
          parsed.state.items = items.slice(0, Math.ceil(items.length / 2));
          next = JSON.stringify(parsed);
        } catch {
          return;
        }
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

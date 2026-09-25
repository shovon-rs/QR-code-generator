import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_QR_OPTIONS } from "@/lib/qr";
import { MAX_HISTORY, useHistoryStore } from "@/store/history-store";
import type { QrItem } from "@/types/qr";

const make = (id: string): QrItem => ({
  id,
  url: `https://example.com/${id}`,
  svg: "<svg/>",
  options: DEFAULT_QR_OPTIONS,
  createdAt: new Date().toISOString(),
});

describe("history store", () => {
  beforeEach(() => useHistoryStore.setState({ items: [] }));

  it("prepends new items", () => {
    useHistoryStore.getState().add(make("a"));
    useHistoryStore.getState().add(make("b"));
    expect(useHistoryStore.getState().items.map((i) => i.id)).toEqual(["b", "a"]);
  });

  it(`caps history at ${MAX_HISTORY}`, () => {
    for (let i = 0; i < MAX_HISTORY + 5; i++) useHistoryStore.getState().add(make(String(i)));
    const items = useHistoryStore.getState().items;
    expect(items).toHaveLength(MAX_HISTORY);
    expect(items[0].id).toBe(String(MAX_HISTORY + 4));
  });

  it("updates, removes and clears", () => {
    const { add, update, remove, clear } = useHistoryStore.getState();
    add(make("a"));
    add(make("b"));
    update("a", { svg: "<svg id='x'/>" });
    expect(useHistoryStore.getState().items.find((i) => i.id === "a")?.svg).toContain("x");
    remove("b");
    expect(useHistoryStore.getState().items.map((i) => i.id)).toEqual(["a"]);
    clear();
    expect(useHistoryStore.getState().items).toEqual([]);
  });

  it("persists to localStorage without the logo data URL", async () => {
    await useHistoryStore.persist.rehydrate();
    useHistoryStore
      .getState()
      .add({ ...make("logo"), options: { ...DEFAULT_QR_OPTIONS, logoDataUrl: "data:big" } });
    const saved = JSON.parse(localStorage.getItem("qr-history") ?? "{}");
    expect(saved.state.items[0].id).toBe("logo");
    expect(saved.state.items[0].options.logoDataUrl).toBeUndefined();
  });
});

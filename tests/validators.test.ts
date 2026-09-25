import { describe, expect, it } from "vitest";

import { MAX_URL_LENGTH, normalizeUrl, urlFormSchema } from "@/lib/validators";

describe("normalizeUrl", () => {
  it("adds https:// when the scheme is missing", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
    expect(normalizeUrl("  www.example.com/path ")).toBe("https://www.example.com/path");
  });

  it("keeps an existing scheme", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
    expect(normalizeUrl("https://example.com")).toBe("https://example.com");
  });
});

describe("urlFormSchema", () => {
  const parse = (url: string) => urlFormSchema.safeParse({ url });

  it("accepts http(s) URLs and returns the normalized value", () => {
    const res = parse("example.com/a?b=1");
    expect(res.success).toBe(true);
    expect(res.data?.url).toBe("https://example.com/a?b=1");
    expect(parse("http://localhost:3000").success).toBe(true);
  });

  it("rejects empty input with the 'required' message", () => {
    const res = parse("   ");
    expect(res.success).toBe(false);
    expect(res.error?.issues[0].message).toMatch(/enter a URL/i);
  });

  it.each(["javascript:alert(1)", "ftp://example.com", "mailto:a@b.com", "not a url", "https://nodot"])(
    "rejects %s",
    (input) => {
      const res = parse(input);
      expect(res.success).toBe(false);
      expect(res.error?.issues[0].message).toMatch(/valid URL/i);
    },
  );

  it("rejects URLs longer than the limit", () => {
    const res = parse(`https://example.com/${"a".repeat(MAX_URL_LENGTH)}`);
    expect(res.success).toBe(false);
  });
});

// Mail preview clipping (Constitution IV: ≤2000 chars retained)
import { describe, it, expect } from "vitest";
import { clipPreview } from "@/lib/mail";

describe("clipPreview", () => {
  it("collapses whitespace and caps at 2000 chars", () => {
    const long = "a ".repeat(5000);
    const out = clipPreview(long);
    expect(out.length).toBeLessThanOrEqual(2000);
  });

  it("trims and normalizes", () => {
    expect(clipPreview("  hello   world \n\t next  ")).toBe("hello world next");
  });
});
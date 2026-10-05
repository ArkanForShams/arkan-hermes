// Agent 007 — brand wordmark single source (Constitution: swap-wired renaming)
export const brand = {
  name: process.env.BRAND_NAME ?? "Agent 007",
  taglineEn: "The issue war room",
  taglineAr: "غرفة عمليات القضايا",
  orgEn: "AlMajdouie — internal",
  orgAr: "المجموعة — داخلي",
  issuePrefix: "A7", // used when project has no key: A7-0142
} as const;

export type Brand = typeof brand;
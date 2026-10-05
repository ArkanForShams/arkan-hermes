// TemplateAI (deterministic fallback): classification + drafting contracts
import { describe, it, expect } from "vitest";
import { TemplateAI } from "@/lib/ai";

const ai = new TemplateAI();

describe("TemplateAI.classifyEmail", () => {
  it("detects real issues", async () => {
    const r = await ai.classifyEmail(
      "URGENT: PO 4500012345 blocked, production line waiting",
      "purchase order stuck",
      ["SAP MM", "Oracle EBS"]
    );
    expect(r.verdict).toBe("issue");
    expect(r.suggestedPriority).toBe("CRITICAL");
  });

  it("filters newsletters as noise", async () => {
    const r = await ai.classifyEmail(
      "Your newsletter: Q4 product catalog",
      "special offers…",
      []
    );
    expect(r.verdict).toBe("noise");
  });

  it("suggests an application when subject mentions one", async () => {
    const r = await ai.classifyEmail(
      "SAP MM: goods receipt timeout", "details", ["SAP MM"]
    );
    expect(r.suggestedApplication).toBe("SAP MM");
  });
});

describe("TemplateAI.draftVendorEmail", () => {
  it("includes issue code, application, and numbered asks (en)", async () => {
    const d = await ai.draftVendorEmail({
      issueCode: "A7-0001", issueTitle: "PO stuck", issueDescription: "ERMS error",
      applicationName: "SAP MM", applicationContext: null,
      vendorName: "SAP", priority: "HIGH", locale: "en",
    });
    expect(d.subject).toContain("[A7-0001]");
    expect(d.body).toContain("SAP MM");
    expect(d.body).toMatch(/1\.\s/);
    expect(d.body).toContain("HIGH");
  });

  it("writes formal Arabic when locale=ar", async () => {
    const d = await ai.draftVendorEmail({
      issueCode: "A7-0002", issueTitle: "خطأ", issueDescription: "",
      applicationName: "Oracle EBS", applicationContext: null,
      vendorName: "Oracle", priority: "HIGH", locale: "ar",
    });
    expect(d.body).toContain("السادة Oracle");
    expect(d.body).toContain("A7-0002");
  });
});

describe("TemplateAI.draftFollowUp", () => {
  it("prefixes FOLLOW UP and mentions days waiting", async () => {
    const d = await ai.draftFollowUp({
      issueCode: "A7-0001", issueTitle: "PO stuck", vendorName: "SAP",
      daysWaiting: 4, lastFollowUpSubject: null, locale: "en",
    });
    expect(d.subject).toMatch(/^FOLLOW UP:/);
    expect(d.subject).toContain("4");
    expect(d.body).toContain("24 hours");
  });
});

describe("TemplateAI.summarizeMeeting", () => {
  it("extracts action items from will/fix lines", async () => {
    const s = await ai.summarizeMeeting(
      "Team reviewed SAP issue.\nAli will check ERMS logs.\nFinance decided to defer batch close.\nDoes the vendor support TLS 1.3?"
    );
    expect(s.actions.length).toBeGreaterThanOrEqual(1);
    expect(s.decisions.some((d) => d.toLowerCase().includes("decided"))).toBe(true);
    expect(s.openQuestions.length).toBeGreaterThanOrEqual(1);
  });
});
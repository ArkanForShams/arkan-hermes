// Agent 007 — AI connector layer (Constitution VIII: swap-wired, no-key fallback)
import "server-only";

export interface EmailClassification {
  verdict: "issue" | "noise";
  rationale: string;
  suggestedApplication?: string;
  suggestedVendor?: string;
  suggestedPriority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  suggestedTitleEn?: string;
  suggestedTitleAr?: string;
}

export interface VendorDraftInput {
  issueCode: string;
  issueTitle: string;
  issueDescription: string;
  applicationName: string;
  applicationContext?: string | null;
  vendorName: string;
  priority: string;
  locale: "en" | "ar";
}

export interface FollowUpDraftInput {
  issueCode: string;
  issueTitle: string;
  vendorName: string;
  daysWaiting: number;
  lastFollowUpSubject?: string | null;
  locale: "en" | "ar";
}

export interface MeetingSummary {
  summaryEn: string;
  summaryAr: string;
  decisions: string[];
  actions: { text: string; suggestedAssignee?: string }[];
  openQuestions: string[];
  nextSteps: string[];
}

export interface ReplyCheck {
  complete: boolean;
  answered: string[];
  unanswered: string[];
  note?: string;
}

export interface AILinear {
  readonly name: string;
  classifyEmail(subject: string, bodyPreview: string, applications: string[]): Promise<EmailClassification>;
  draftVendorEmail(input: VendorDraftInput): Promise<{ subject: string; body: string }>;
  draftFollowUp(input: FollowUpDraftInput): Promise<{ subject: string; body: string }>;
  checkReplyCompleteness(questionsAsked: string[], replyText: string): Promise<ReplyCheck>;
  summarizeMeeting(rawNotes: string): Promise<MeetingSummary>;
}

// ---------- helpers ----------
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error("no JSON in AI response");
  const end = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
  return JSON.parse(candidate.slice(start, end + 1));
}

async function chatComplete(messages: { role: string; content: string }[]): Promise<string> {
  const baseUrl = process.env.AI_BASE_URL;
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!baseUrl || !key || !model) throw new Error("AI_NOT_CONFIGURED");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45_000);
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages, temperature: 0.3 }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`AI_HTTP_${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI_EMPTY");
    return content;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- OpenAI-compatible adapter ----------
export class OpenAICompatAI implements AILinear {
  readonly name = "openai-compat";

  async classifyEmail(subject: string, bodyPreview: string, applications: string[]): Promise<EmailClassification> {
    const raw = await chatComplete([
      { role: "system", content:
        "You triage corporate support inboxes. Reply ONLY with JSON: {\"verdict\":\"issue|noise\",\"rationale\":\"short\",\"suggestedApplication\":one of the list or null,\"suggestedPriority\":\"LOW|MEDIUM|HIGH|CRITICAL\",\"suggestedTitleEn\":\"<=80 chars\",\"suggestedTitleAr\":\"Arabic translation\"}. A issue = a real operational/technical problem needing action. noise = newsletters, marketing, automated no-action mail." },
      { role: "user", content: `Known applications: ${applications.join(", ") || "(none)"}\nSubject: ${subject}\nBody: ${bodyPreview}` },
    ]);
    const j = extractJson(raw) as EmailClassification;
    return {
      verdict: j.verdict === "issue" ? "issue" : "noise",
      rationale: String(j.rationale ?? ""),
      suggestedApplication: j.suggestedApplication ?? undefined,
      suggestedPriority: j.suggestedPriority,
      suggestedTitleEn: j.suggestedTitleEn ?? undefined,
      suggestedTitleAr: j.suggestedTitleAr ?? undefined,
    };
  }

  async draftVendorEmail(i: VendorDraftInput): Promise<{ subject: string; body: string }> {
    const raw = await chatComplete([
      { role: "system", content:
        "You draft escalation emails from a corporate IT department to a vendor's support team. Professional, precise, formal. Include: issue summary, how it occurred / error context, business impact, and specific requested actions with a response deadline. Output JSON: {\"subject\":\"...\",\"body\":\"...\"}. The body must be plain text with clear paragraphs. If locale=ar, write in formal Arabic." },
      { role: "user", content: `Locale: ${i.locale}\nIssue code: ${i.issueCode}\nIssue title: ${i.issueTitle}\nDescription: ${i.issueDescription}\nApplication: ${i.applicationName}${i.applicationContext ? `\nApplication technical context: ${i.applicationContext}` : ""}\nVendor: ${i.vendorName}\nPriority: ${i.priority}` },
    ]);
    const j = extractJson(raw) as { subject: string; body: string };
    return { subject: `[${i.issueCode}] ${j.subject || i.issueTitle}`, body: j.body };
  }

  async draftFollowUp(i: FollowUpDraftInput): Promise<{ subject: string; body: string }> {
    const raw = await chatComplete([
      { role: "system", content:
        "You draft polite but firm daily follow-up emails to a vendor who has not replied. Reference the original issue, note the days waiting, and request an update with a concrete deadline. Output JSON: {\"subject\":\"...\",\"body\":\"...\"}. If locale=ar, write in formal Arabic." },
      { role: "user", content: `Locale: ${i.locale}\nIssue code: ${i.issueCode}\nIssue: ${i.issueTitle}\nVendor: ${i.vendorName}\nDays waiting: ${i.daysWaiting}\nPrevious subject: ${i.lastFollowUpSubject ?? "(none)"}` },
    ]);
    const j = extractJson(raw) as { subject: string; body: string };
    return { subject: j.subject.startsWith("RE:") ? j.subject : `FOLLOW UP: [${i.issueCode}] ${j.subject || i.issueTitle}`, body: j.body };
  }

  async checkReplyCompleteness(questionsAsked: string[], replyText: string): Promise<ReplyCheck> {
    if (questionsAsked.length === 0) return { complete: true, answered: [], unanswered: [] };
    const raw = await chatComplete([
      { role: "system", content:
        "Compare a vendor's reply against the questions we asked. Output JSON: {\"complete\":bool,\"answered\":[...],\"unanswered\":[...],\"note\":\"one line\"}." },
      { role: "user", content: `We asked:\n${questionsAsked.map((q, n) => `${n + 1}. ${q}`).join("\n")}\n\nVendor replied:\n${replyText}` },
    ]);
    const j = extractJson(raw) as ReplyCheck;
    return { complete: !!j.complete, answered: j.answered ?? [], unanswered: j.unanswered ?? [], note: j.note };
  }

  async summarizeMeeting(rawNotes: string): Promise<MeetingSummary> {
    const raw = await chatComplete([
      { role: "system", content:
        "Summarize corporate meeting notes. Output JSON: {\"summaryEn\":\"...\",\"summaryAr\":\"...\",\"decisions\":[\"...\"],\"actions\":[{\"text\":\"...\",\"suggestedAssignee\":\"name or null\"}],\"openQuestions\":[\"...\"],\"nextSteps\":[\"...\"]}. Be concrete; keep items short." },
      { role: "user", content: rawNotes.slice(0, 12_000) },
    ]);
    const j = extractJson(raw) as MeetingSummary;
    return {
      summaryEn: j.summaryEn ?? "",
      summaryAr: j.summaryAr ?? "",
      decisions: j.decisions ?? [],
      actions: j.actions ?? [],
      openQuestions: j.openQuestions ?? [],
      nextSteps: j.nextSteps ?? [],
    };
  }
}

// ---------- Deterministic fallback (no API key; keeps product usable) ----------
export class TemplateAI implements AILinear {
  readonly name = "template-fallback";

  async classifyEmail(subject: string, _bodyPreview: string, applications: string[]): Promise<EmailClassification> {
    const s = subject.toLowerCase();
    const noiseWords = ["newsletter", "catalog", "offer", "unsubscribe", "notification", "digest", "webinar", "promo"];
    const isNoise = noiseWords.some((w) => s.includes(w));
    const app = applications.find((a) => s.toLowerCase().includes(a.toLowerCase().split(" ")[0]));
    return {
      verdict: isNoise ? "noise" : "issue",
      rationale: isNoise ? "Matches known non-action patterns (keyword rules)" : "No noise keywords matched (keyword rules)",
      suggestedApplication: app,
      suggestedPriority: /urgent|critical|blocked|down|stopp/i.test(s) ? "CRITICAL" : /fail|error|reject/i.test(s) ? "HIGH" : "MEDIUM",
      suggestedTitleEn: subject.replace(/^re:\s*/i, "").slice(0, 80),
      suggestedTitleAr: subject.replace(/^re:\s*/i, "").slice(0, 80),
    };
  }

  async draftVendorEmail(i: VendorDraftInput): Promise<{ subject: string; body: string }> {
    if (i.locale === "ar") {
      return {
        subject: `[${i.issueCode}] ${i.issueTitle} — مطلوب إجراء من فريقكم`,
        body:
          `السادة ${i.vendorName} المحترمين،\n\nتحية طيبة،\n\nنعود إليكم بخصوص القضية رقم ${i.issueCode} المتعلقة بتطبيق ${i.applicationName}:\n\n» ${i.issueTitle}\n${i.issueDescription ? `\nالتفاصيل:\n${i.issueDescription}\n` : ""}\nأثر العمل: يتسبب هذا الخطأ في تعطل العمليات المرتبطة.\n\nنرجو من فريقكم:\n1) تأكيد استلام القضية وتخصيص رقم مرجعي.\n2) تحليل السبب الجذري وتزويدنا بخطوات الحل.\n3) الرد خلال يوم عمل واحد.\n\nنحيّطكم علماً أن أولوية القضية: ${i.priority}.\n\nمع التقدير،\nإدارة تطبيقات تقنية المعلومات — المجموعة`,
      };
    }
    return {
      subject: `[${i.issueCode}] ${i.issueTitle} — action required`,
      body:
        `Dear ${i.vendorName} Support Team,\n\nWe are reporting the following issue on ${i.applicationName} and request your formal handling:\n\nIssue ${i.issueCode}: ${i.issueTitle}\n${i.issueDescription ? `\nDetails / how it occurred:\n${i.issueDescription}\n` : ""}\nBusiness impact: related operations are delayed or blocked for our users.\n\nWe kindly request:\n1. Acknowledge receipt of this issue with a reference number.\n2. Root-cause analysis and a remediation plan.\n3. A reply within one business day.\n\nPriority for this issue: ${i.priority}.\n\nBest regards,\nIT Applications Department — AlMajdouie`,
    };
  }

  async draftFollowUp(i: FollowUpDraftInput): Promise<{ subject: string; body: string }> {
    if (i.locale === "ar") {
      return {
        subject: `متابعة: [${i.issueCode}] ${i.issueTitle} (${i.daysWaiting} يوم بلا رد)`,
        body: `السادة ${i.vendorName} المحترمين،\n\nمتابعةً للقضية ${i.issueCode} المرسلة سابقاً — لم يتوفر رد حتى الآن منذ ${i.daysWaiting} يوم.\n\nنرجو تحديث الحالة خلال 24 ساعة، وإلا سنضطر للتصعيد.\n\nمع التقدير،\nإدارة تطبيقات تقنية المعلومات — المجموعة`,
      };
    }
    return {
      subject: `FOLLOW UP: [${i.issueCode}] ${i.issueTitle} (${i.daysWaiting}d awaiting reply)`,
      body: `Dear ${i.vendorName} Support Team,\n\nFollowing up on issue ${i.issueCode} (${i.issueTitle}) — we have not received a response for ${i.daysWaiting} day(s).\n\nPlease provide a status update within 24 hours, otherwise we will escalate through our account channel.\n\nBest regards,\nIT Applications Department — AlMajdouie`,
    };
  }

  async checkReplyCompleteness(_q: string[], _r: string): Promise<ReplyCheck> {
    return { complete: false, answered: [], unanswered: [], note: "Keyword fallback cannot verify completeness — review manually." };
  }

  async summarizeMeeting(rawNotes: string): Promise<MeetingSummary> {
    const lines = rawNotes.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const actions = lines.filter((l) => /(will|todo|action|follow|check|send|fix|يرجى|سوف)/i.test(l)).slice(0, 10)
      .map((text) => ({ text }));
    return {
      summaryEn: lines.slice(0, 5).join(" "),
      summaryAr: lines.slice(0, 5).join(" "),
      decisions: lines.filter((l) => /(decided|agreed|قرر|اتفق)/i.test(l)).slice(0, 5),
      actions,
      openQuestions: lines.filter((l) => l.includes("?") || /(question|clarif|سؤال)/i.test(l)).slice(0, 5),
      nextSteps: actions.slice(0, 3).map((a) => a.text),
    };
  }
}

// ---------- factory (Constitution VIII) ----------
let cached: AILinear | null = null;

export function getAI(): AILinear {
  if (cached) return cached;
  const configured = !!(process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL);
  cached = configured ? new OpenAICompatAI() : new TemplateAI();
  return cached;
}

export function aiIsConfigured(): boolean {
  return !!(process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL);
}
// Agent 007 — seed: dev users, projects, vendor mapping, demo inbox
// Run: npm run seed  (dev only — passwords are printed here by design, change before real deployment)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const STAGES = [
  "NEW",
  "ANALYZING",
  "WITH_VENDOR",
  "FOLLOW_UP",
  "RESOLVED",
  "CLOSED",
] as const;

async function main() {
  console.log("Seeding Agent 007…");

  const pass = await bcrypt.hash("ChangeMe!2026", 12);

  // --- Users ---
  const shams = await prisma.user.upsert({
    where: { username: "shams" },
    update: {},
    create: {
      username: "shams",
      displayName: "Shams Tabrez",
      email: "shams@almajdouie.internal",
      passwordHash: pass,
      role: "ADMIN",
      locale: "en",
    },
  });
  const team1 = await prisma.user.upsert({
    where: { username: "team1" },
    update: {},
    create: {
      username: "team1",
      displayName: "Team Member One",
      passwordHash: pass,
      role: "TEAM",
    },
  });
  const team2 = await prisma.user.upsert({
    where: { username: "team2" },
    update: {},
    create: {
      username: "team2",
      displayName: "Team Member Two",
      passwordHash: pass,
      role: "TEAM",
    },
  });
  await prisma.user.upsert({
    where: { username: "viewer1" },
    update: {},
    create: {
      username: "viewer1",
      displayName: "Department Viewer",
      passwordHash: pass,
      role: "VIEWER",
    },
  });

  // --- Projects ---
  const ops = await prisma.project.upsert({
    where: { key: "OPS" },
    update: {},
    create: {
      key: "OPS",
      nameEn: "Operations Support",
      nameAr: "دعم العمليات",
      descEn: "Daily operational issues and vendor escalations",
      descAr: "قضايا العمليات اليومية وتصعيد الموردين",
      colorTag: "#0E4C5C",
      members: {
        create: [
          { userId: shams.id, role: "ADMIN" },
          { userId: team1.id, role: "TEAM" },
          { userId: team2.id, role: "TEAM" },
        ],
      },
    },
  });
  const apps = await prisma.project.upsert({
    where: { key: "APPS" },
    update: {},
    create: {
      key: "APPS",
      nameEn: "Applications",
      nameAr: "التطبيقات",
      descEn: "Application lifecycle and enhancements",
      descAr: "دورة حياة التطبيقات والتطويرات",
      colorTag: "#3E7C59",
      members: { create: [{ userId: shams.id, role: "ADMIN" }] },
    },
  });

  // --- Vendor ↔ Application mapping ---
  const sap = await prisma.vendor.upsert({
    where: { name: "SAP" },
    update: {},
    create: {
      name: "SAP",
      supportEmail: "support@sap-vendor.example.com",
      escalationEmail: "escalations@sap-vendor.example.com",
      notesEn: "Standard support contract, response SLA 8h",
    },
  });
  const oracle = await prisma.vendor.upsert({
    where: { name: "Oracle" },
    update: {},
    create: {
      name: "Oracle",
      supportEmail: "support@oracle-vendor.example.com",
    },
  });
  const msft = await prisma.vendor.upsert({
    where: { name: "Microsoft" },
    update: {},
    create: {
      name: "Microsoft",
      supportEmail: "support@microsoft-vendor.example.com",
    },
  });

  const sapMM = await prisma.application.upsert({
    where: { name: "SAP MM" },
    update: {},
    create: {
      name: "SAP MM",
      vendorId: sap.id,
      contextEn:
        "Materials Management module; purchase orders, goods receipt, invoices. Integration with SAP PI middleware.",
    },
  });
  const oracleEBS = await prisma.application.upsert({
    where: { name: "Oracle EBS" },
    update: {},
    create: {
      name: "Oracle EBS",
      vendorId: oracle.id,
      contextEn: "E-Business Suite R12; financials and procurement.",
    },
  });
  const m365 = await prisma.application.upsert({
    where: { name: "Microsoft 365" },
    update: {},
    create: {
      name: "Microsoft 365",
      vendorId: msft.id,
      contextEn: "Exchange Online, SharePoint, Teams tenant.",
    },
  });

  // --- Demo issues across stages ---
  const mkIssue = async (
    n: number,
    projectId: string,
    titleEn: string,
    titleAr: string,
    stage: (typeof STAGES)[number],
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    assigneeId: string | null,
    applicationId: string | null,
    daysOld = 1
  ) => {
    const code = `${projectId === ops.id ? "OPS" : "APPS"}-${String(n).padStart(4, "0")}`;
    await prisma.issue.upsert({
      where: { code },
      update: {},
      create: {
        code,
        number: n,
        projectId,
        titleEn,
        titleAr,
        stage,
        priority,
        assigneeId,
        applicationId,
        source: "outlook",
        enteredVendorAt: stage === "WITH_VENDOR" || stage === "FOLLOW_UP"
          ? new Date(Date.now() - (daysOld + 1) * 24 * 3600 * 1000)
          : null,
        createdAt: new Date(Date.now() - daysOld * 24 * 3600 * 1000),
      },
    });
  };

  await mkIssue(1, ops.id, "Purchase order stuck in approval ERMS error", "أمر شراء متوقف في خطأ الاعتماد", "WITH_VENDOR", "HIGH", team1.id, sapMM.id, 3);
  await mkIssue(2, ops.id, "Goods receipt posting fails with timeout", "ترحيل استلام البضاعة يفشل بمهلة زمنية", "FOLLOW_UP", "CRITICAL", team1.id, sapMM.id, 4);
  await mkIssue(3, ops.id, "Duplicate vendor master records", "سجلات موردين مكررة", "ANALYZING", "MEDIUM", team2.id, oracleEBS.id, 2);
  await mkIssue(4, apps.id, "Teams channel retention policy not applying", "سياسة الاحتفاظ لا تُطبق على قنوات الفرق", "WITH_VENDOR", "MEDIUM", team2.id, m365.id, 2);
  await mkIssue(5, apps.id, "SharePoint permission drift on project sites", "انحراف صلاحيات على مواقع المشاريع", "NEW", "LOW", null, m365.id, 1);
  await mkIssue(6, ops.id, "Invoice interface rejects negative amounts", "واجهة الفواتير ترفض المبالغ السالبة", "RESOLVED", "MEDIUM", team1.id, oracleEBS.id, 8);

  // --- Demo inbox (used by DemoMailConnector / triage) ---
  const demoEmails = [
    {
      id: "demo-001@sap",
      fromAddr: "procurement@almajdouie.internal",
      subject: "URGENT: PO 4500012345 blocked, production line waiting",
      bodyPreview:
        "Since yesterday our purchase order 4500012345 is stuck in approval. The plant cannot receive materials and the production line is waiting. System shows ERMS error when approving. This stopped our receiving process.",
      hoursAgo: 2,
    },
    {
      id: "demo-002@vendor",
      fromAddr: "noreply@vendor-portal.example.com",
      subject: "Your newsletter: Q4 product catalog",
      bodyPreview: "Special offers and new catalog items for Q4…",
      hoursAgo: 5,
    },
    {
      id: "demo-003@finance",
      fromAddr: "finance@almajdouie.internal",
      subject: "Oracle EBS: journal import rejects batch J-2026-114",
      bodyPreview:
        "Journal import batch J-2026-114 was rejected twice with error APP-FND-00688. Finance cannot close the month without these entries.",
      hoursAgo: 7,
    },
  ];
  for (const e of demoEmails) {
    await prisma.emailMessage.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id,
        fromAddr: e.fromAddr,
        subject: e.subject,
        bodyPreview: e.bodyPreview,
        receivedAt: new Date(Date.now() - e.hoursAgo * 3600 * 1000),
      },
    });
  }

  // Stand-up meeting sample
  await prisma.meeting.create({
    data: {
      projectId: ops.id,
      title: "Daily stand-up — operations",
      type: "STANDUP",
      heldOn: new Date(),
      rawNotes:
        "PO approval issue with SAP blocking plant receiving. Team checking ERMS logs. Oracle journal import rejected twice, finance blocked. SharePoint permissions drift reported by PMO.",
      createdBy: shams.id,
    },
  });

  console.log("Seed complete.");
  console.log("Accounts: shams / team1 / team2 / viewer1 — password: ChangeMe!2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
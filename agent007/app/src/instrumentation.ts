// Agent 007 — scheduler: inbox polling + daily follow-up tick (node-cron, server singleton)
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const cron = (await import("node-cron")).default;
  const { pollInbox } = await import("@/lib/services/ingest");
  const { runDailyTick } = await import("@/lib/services/followups");

  const pollMinutes = Math.max(5, Number(process.env.INGEST_POLL_MINUTES ?? 15));

  // Inbox polling (read-only)
  cron.schedule(`*/${pollMinutes} * * * *`, async () => {
    try {
      const r = await pollInbox();
      if (r.ingested > 0) console.log(`[ingest] +${r.ingested} mails, ${r.classified} classified`);
    } catch (e) {
      console.warn("[ingest] poll failed:", String(e).slice(0, 120));
    }
  });

  // Follow-up engine — every day 07:30 server time + on boot catch-up
  cron.schedule("30 7 * * *", async () => {
    try {
      const r = await runDailyTick(null);
      console.log(`[followups] prepared:${r.prepared} repliesMatched:${r.repliesMatched}`);
    } catch (e) {
      console.warn("[followups] tick failed:", String(e).slice(0, 120));
    }
  });

  // Boot catch-up (covers server restarts on the scheduled day)
  setTimeout(() => {
    runDailyTick(null)
      .then((r) => console.log(`[followups] boot tick prepared:${r.prepared} matched:${r.repliesMatched}`))
      .catch(() => undefined);
  }, 15_000);

  console.log("[scheduler] registered: ingest every %dmin, followups daily 07:30", pollMinutes);
}
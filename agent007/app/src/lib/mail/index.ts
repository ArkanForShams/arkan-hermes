// Agent 007 — mail connector layer (Constitution III: READ-ONLY, enforced by scope + code)
import "server-only";

export interface MailMessage {
  id: string; // provider message id (dedupe key)
  fromAddr: string;
  subject: string;
  bodyPreview: string; // <= 2000 chars stored (Constitution IV)
  receivedAt: Date;
}

export interface MailConnector {
  readonly name: string;
  /** Fetch recent inbox messages (read-only). NEVER mutates the mailbox. */
  fetchRecent(since: Date, limit?: number): Promise<MailMessage[]>;
}

const MAX_PREVIEW = 2000;

export function clipPreview(body: string): string {
  return body.replace(/\s+/g, " ").trim().slice(0, MAX_PREVIEW);
}

// ---------- Demo connector (simulated inbox backed by seeded EmailMessage rows) ----------
export class DemoMailConnector implements MailConnector {
  readonly name = "demo";

  async fetchRecent(since: Date, limit = 20): Promise<MailMessage[]> {
    // Simulates the mailbox: unclassified inbound rows act as "new inbox mail".
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.emailMessage.findMany({
      where: { classified: false, receivedAt: { gte: since }, direction: "inbound" },
      orderBy: { receivedAt: "desc" },
      take: limit,
    });
    return rows.map((r) => ({
      id: r.id,
      fromAddr: r.fromAddr,
      subject: r.subject,
      bodyPreview: r.bodyPreview,
      receivedAt: r.receivedAt,
    }));
  }
}

// ---------- Microsoft Graph connector (delegated, Mail.Read only) ----------
// One-time provisioning (documented in README):
//   1. Azure portal → App registration → delegated Mail.Read + offline_access,
//      enable public client device flow OR run a one-time auth-code exchange.
//   2. Store GRAPH_REFRESH_TOKEN in .env. The app refreshes access tokens itself.
export class GraphMailConnector implements MailConnector {
  readonly name = "graph";

  private clientId() { return process.env.GRAPH_CLIENT_ID ?? ""; }
  private tenant() { return process.env.GRAPH_TENANT_ID ?? "common"; }
  private mailbox() { return process.env.GRAPH_USER_EMAIL ?? "me"; }
  private cached: { token: string; expiresAt: number } | null = null;

  private async acquireToken(): Promise<string> {
    if (this.cached && this.cached.expiresAt > Date.now() + 60_000) return this.cached.token;
    const refreshToken = process.env.GRAPH_REFRESH_TOKEN;
    if (!refreshToken || !this.clientId()) throw new Error("GRAPH_NOT_CONFIGURED");
    const body = new URLSearchParams({
      client_id: this.clientId(),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      scope: "Mail.Read offline_access",
    });
    const res = await fetch(
      `https://login.microsoftonline.com/${this.tenant()}/oauth2/v2.0/token`,
      { method: "POST", body, headers: { "content-type": "application/x-www-form-urlencoded" } }
    );
    if (!res.ok) throw new Error(`GRAPH_TOKEN_${res.status}`);
    const j = (await res.json()) as { access_token: string; expires_in?: number };
    this.cached = { token: j.access_token, expiresAt: Date.now() + (j.expires_in ?? 3600) * 1000 };
    return this.cached.token;
  }

  async fetchRecent(since: Date, limit = 20): Promise<MailMessage[]> {
    const token = await this.acquireToken();
    const filter = `receivedDateTime ge ${since.toISOString()}`;
    const url =
      `https://graph.microsoft.com/v1.0/users/${this.mailbox()}/mailFolders/Inbox/messages` +
      `?$filter=${encodeURIComponent(filter)}&$orderBy=receivedDateTime desc&$top=${Math.min(limit, 50)}` +
      `&$select=id,from,subject,bodyPreview,receivedDateTime`;
    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`GRAPH_LIST_${res.status}`);
    const j = (await res.json()) as {
      value: {
        id: string;
        from?: { emailAddress?: { address?: string } };
        subject?: string;
        bodyPreview?: string;
        receivedDateTime: string;
      }[];
    };
    return (j.value ?? []).map((m) => ({
      id: m.id,
      fromAddr: m.from?.emailAddress?.address ?? "unknown",
      subject: m.subject ?? "(no subject)",
      bodyPreview: clipPreview(m.bodyPreview ?? ""),
      receivedAt: new Date(m.receivedDateTime),
    }));
  }
}

export function getMailConnector(): MailConnector {
  return (process.env.MAIL_CONNECTOR ?? "demo") === "graph" && process.env.GRAPH_CLIENT_ID
    ? new GraphMailConnector()
    : new DemoMailConnector();
}
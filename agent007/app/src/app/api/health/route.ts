// Agent 007 — health endpoint (unauthenticated, minimal info)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, service: "agent007", ts: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false, service: "agent007" }, { status: 503 });
  }
}
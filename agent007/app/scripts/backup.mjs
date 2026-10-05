// backups + WAL check
import { execSync } from "node:child_process";
import { mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");
const dbPath = join(appRoot, "prisma", "dev.db");
const backupDir = join(appRoot, "backups");

mkdirSync(backupDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const dest = join(backupDir, `agent007-${stamp}.db`);

// WAL-safe snapshot: use sqlite3 .backup if available, else plain copy
try {
  execSync(`sqlite3 "${dbPath}" ".backup '${dest}'"`, { stdio: "pipe" });
  console.log(`Backup (sqlite3 .backup): ${dest}`);
} catch {
  copyFileSync(dbPath, dest);
  console.log(`Backup (file copy): ${dest}`);
}
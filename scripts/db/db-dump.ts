import dotenv from "dotenv";
import { execSync } from "node:child_process";
import fs from "node:fs";

dotenv.config({ path: ".env.local" });

const url = process.env.PRODUCTION_DATABASE_URL;

if (!url) {
  throw new Error("Missing PRODUCTION_DATABASE_URL");
}

const buffer = execSync(`pg_dump "${url}"`, {
  shell: "powershell.exe",
  maxBuffer: 1024 * 1024 * 50, // 50MB
});

fs.writeFileSync("dump.sql", buffer);

console.log("Database dump completed");

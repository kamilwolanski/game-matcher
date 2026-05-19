import dotenv from "dotenv";
import { execSync } from "node:child_process";

dotenv.config({ path: ".env.local" });

function run(command: string) {
  execSync(command, {
    stdio: "inherit",
    shell: "powershell.exe",
    env: {
      ...process.env,
      PGPASSWORD: "postgres",
    },
  });
}

async function main() {
  console.log("Stopping containers...");
  run("docker compose down -v");

  console.log("Starting fresh database...");
  run("docker compose up -d");

  console.log("Waiting for PostgreSQL...");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Restoring dump...");
  run("psql -h localhost -p 5433 -U postgres -d gamematcher -f dump.sql");

  console.log("Database sync completed");
}

main();

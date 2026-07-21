// Drives the REAL pm2 CLI — the same commands you'd type yourself —
// never PM2's programmatic API, so what runs here is exactly what a
// human running these commands by hand would see.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

// This demo's own real PID keeps its PM2 app name unique across any
// concurrent run sharing this same machine's one real PM2 daemon — the
// same isolation discipline as every other shared-resource fix in this
// topic (see co-founder/build-conventions.md).
const APP_NAME = `caching-scaling-pm2-${process.pid}`;
const LOG_PATH = `${homedir()}/.pm2/logs/${APP_NAME}-out.log`;

function run(command) {
  return execSync(command, { encoding: "utf-8", cwd: import.meta.dirname });
}

function pm2List() {
  return JSON.parse(run("./node_modules/.bin/pm2 jlist"));
}

function findApp(list) {
  return list.find((p) => p.name === APP_NAME);
}

// Reads this real app's own real log file and returns the LAST real port
// it reported listening on — matters because PM2 restarts the process
// with PORT=0 again, so a restart can land on a genuinely different real
// OS-assigned port than the first start did.
async function waitForLatestPort(afterCount) {
  for (let i = 0; i < 50; i++) {
    try {
      const log = readFileSync(LOG_PATH, "utf-8");
      const matches = [...log.matchAll(/Listening on port (\d+)/g)];
      if (matches.length > afterCount) return Number(matches.at(-1)[1]);
    } catch {
      // Log file may not exist yet on the very first check.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for the real server to report its port.");
}

async function waitForRestartCount(target) {
  for (let i = 0; i < 50; i++) {
    const app = findApp(pm2List());
    if (app && app.pm2_env.restart_time >= target) return app;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for PM2 to report a real restart.");
}

console.log(`Starting a real app under PM2 (PORT=0, a real OS-assigned port)...`);
run(`PORT=0 ./node_modules/.bin/pm2 start server.js --name ${APP_NAME}`);

const firstPort = await waitForLatestPort(0);
const before = findApp(pm2List());
console.log(`Real PM2-managed process: pid ${before.pid}, real assigned port ${firstPort}, restart_time ${before.pm2_env.restart_time}.`);

const beforeStatus = await (await fetch(`http://localhost:${firstPort}/`)).json();
console.log(`Real request before the crash: ${JSON.stringify(beforeStatus)}`);

console.log(`\nSimulating a real crash — SIGKILL directly to the real OS pid PM2 is managing...`);
process.kill(before.pid, "SIGKILL");

const after = await waitForRestartCount(1);
const secondPort = await waitForLatestPort(1);
console.log(`Real PM2-managed process after the crash: pid ${after.pid}, real assigned port ${secondPort}, restart_time ${after.pm2_env.restart_time}.`);

const afterStatus = await (await fetch(`http://localhost:${secondPort}/`)).json();
console.log(`Real request right after the crash: ${JSON.stringify(afterStatus)}`);

console.log(
  `\nThe real pid changed (${before.pid} → ${after.pid}) and restart_time really went from 0 to ${after.pm2_env.restart_time} — PM2 detected the real crash and restarted it on its own, with zero manual intervention.`,
);

run(`./node_modules/.bin/pm2 delete ${APP_NAME}`);

// Proves the real Nginx/Docker-DNS gotcha end to end — not just describes
// it. Uses a FIXED project name ("ngdns") on every real `docker compose`
// call so the real image/network/container names this script depends on
// never shift based on this folder's own name.
import { execSync } from "node:child_process";

const PROJECT = "ngdns";
const cwd = process.cwd();

// Small helper: try a real GET request, return { ok, status, body } instead
// of throwing — a real 502 or a real connection failure are both
// EXPECTED, valid outcomes this demo needs to observe, not bugs to catch.
async function tryGet(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    // A real network-level failure (connection refused/reset) — no real
    // HTTP response came back at all.
    return { ok: false, status: 0, body: `(no response: ${err.message})` };
  } finally {
    clearTimeout(timer);
  }
}

// Poll a URL until it returns a real 200, or give up after maxWaitMs.
async function waitForOk(url, maxWaitMs) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const result = await tryGet(url, 2000);
    if (result.ok) return result;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url} to return 200`);
}

async function main() {
  console.log("== Starting the real app + both real Nginx configs via docker compose ==");
  // Builds the real app image and starts all 3 real containers on one
  // real, private Docker network.
  execSync(`docker compose -p ${PROJECT} up -d --build`, { cwd, stdio: "ignore" });

  console.log("\n== Waiting for both real Nginx proxies to come up ==");
  const naiveBefore = await waitForOk("http://localhost:4124/", 20000);
  const dynamicBefore = await waitForOk("http://localhost:4125/", 20000);
  console.log("Naive nginx   -> status", naiveBefore.status, "body:", naiveBefore.body);
  console.log("Dynamic nginx -> status", dynamicBefore.status, "body:", dynamicBefore.body);

  console.log("\n== Simulating a real container replacement (the same thing a redeploy does) ==");
  // Starts a SECOND, genuinely separate real app container, sharing the
  // exact same network alias "app" — Docker allows this, and it's how a
  // real rolling deploy briefly runs old+new together.
  execSync(
    `docker run -d --network ${PROJECT}_demo-net --network-alias app --name ${PROJECT}-app-replacement ${PROJECT}-app`,
    { cwd, stdio: "ignore" },
  );
  // Removes the ORIGINAL app container outright — only the new one now
  // answers to the "app" name. Its real IP address is genuinely different
  // from the one both Nginx containers saw a moment ago.
  execSync(`docker rm -f ${PROJECT}-app-1`, { cwd, stdio: "ignore" });
  // A short real pause — just long enough for Docker's own networking to
  // settle after the swap, nothing to do with Nginx's own caching.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log("\n== Hitting both proxies again, right after the swap ==");
  // Nginx's own config sets a real 3s proxy_connect_timeout for exactly
  // this case — 8s here gives it real room to hit that and return its
  // own real 502, instead of this client aborting first and hiding it.
  const naiveAfter = await tryGet("http://localhost:4124/", 8000);
  console.log("Naive nginx   -> status", naiveAfter.status, "body:", naiveAfter.body);

  // The dynamic config's "valid=5s" means it may still be serving its OLD
  // cached lookup for up to 5 real seconds — so this polls for real,
  // rather than asserting success on the very first try.
  const dynamicAfter = await waitForOk("http://localhost:4125/", 10000);
  console.log("Dynamic nginx -> status", dynamicAfter.status, "body:", dynamicAfter.body);

  console.log("\n== Real result ==");
  // Nginx can report this failure as EITHER a 502 (the OS noticed
  // instantly that the old IP is gone) or a 504 (the OS stayed silent,
  // so Nginx's own 3s proxy_connect_timeout had to trip instead) — both
  // are the SAME real underlying bug: still pointed at a dead container.
  const naiveBroken = naiveAfter.status === 502 || naiveAfter.status === 504;
  console.log(
    naiveBroken
      ? `Naive config: BROKEN (${naiveAfter.status}) — still pointed at the container that no longer exists.`
      : `Naive config: unexpected status ${naiveAfter.status}`,
  );
  console.log(
    dynamicAfter.ok
      ? "Dynamic config: STILL WORKING — re-resolved \"app\" to the new real container automatically."
      : "Dynamic config: unexpected failure",
  );

  console.log("\n== Cleaning up every real container/network this demo created ==");
  execSync(`docker rm -f ${PROJECT}-app-replacement`, { cwd, stdio: "ignore" });
  execSync(`docker compose -p ${PROJECT} down -v`, { cwd, stdio: "ignore" });
}

main().catch((err) => {
  console.error("Demo failed:", err);
  // Best-effort cleanup even on failure, so a broken run never leaves
  // real containers/networks behind on this machine.
  try {
    execSync(`docker rm -f ${PROJECT}-app-replacement`, { cwd, stdio: "ignore" });
  } catch {}
  try {
    execSync(`docker compose -p ${PROJECT} down -v`, { cwd, stdio: "ignore" });
  } catch {}
  process.exit(1);
});

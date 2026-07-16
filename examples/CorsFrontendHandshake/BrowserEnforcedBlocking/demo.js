// Real proof, using a real headless Chromium browser, that CORS
// blocking is entirely a CLIENT-side decision — the server always
// finishes and answers; the question is only whether the browser lets
// the page's own JS see that answer.
const { chromium } = require("playwright");
const express = require("express");
const { createApiServer } = require("./api-server");

async function main() {
  const FRONTEND_PORT = 5311;
  const API_PORT = 5312;

  const apiServer = createApiServer(`http://localhost:${FRONTEND_PORT}`).listen(API_PORT);

  const frontendApp = express();
  frontendApp.get("/", (req, res) => {
    res.send(`<html><body><script>
      window.results = {};
      (async () => {
        try {
          const noCors = await fetch('http://localhost:${API_PORT}/no-cors');
          window.results.noCors = { ok: true, data: await noCors.json() };
        } catch (e) {
          window.results.noCors = { ok: false, error: e.message };
        }

        try {
          const withCors = await fetch('http://localhost:${API_PORT}/with-cors');
          window.results.withCors = { ok: true, data: await withCors.json() };
        } catch (e) {
          window.results.withCors = { ok: false, error: e.message };
        }

        // Set a real cookie on the API's own origin first.
        await fetch('http://localhost:${API_PORT}/set-cookie', { credentials: 'include' });

        // Request 1: default fetch, no credentials option — the cookie
        // is NOT sent, even though the browser already has it stored
        // for the API's origin.
        const withoutCredsRes = await fetch('http://localhost:${API_PORT}/whoami');
        window.results.withoutCredentialsOption = await withoutCredsRes.json();

        // Request 2: credentials: 'include' — the cookie IS sent, since
        // both the client opts in AND the server allows it.
        const withCredsRes = await fetch('http://localhost:${API_PORT}/whoami', { credentials: 'include' });
        window.results.withCredentialsOption = await withCredsRes.json();

        window.done = true;
      })();
    </script></body></html>`);
  });
  const frontendServer = frontendApp.listen(FRONTEND_PORT);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  await page.goto(`http://localhost:${FRONTEND_PORT}`);
  await page.waitForFunction(() => window.done === true);
  const results = await page.evaluate(() => window.results);

  console.log("GET /no-cors (server sends NO CORS headers at all):");
  console.log(JSON.stringify(results.noCors));
  console.log("\nGET /with-cors (server allows this exact origin):");
  console.log(JSON.stringify(results.withCors));

  console.log("\nReal browser console error, captured directly (this is the actual, real message Chromium produces — not paraphrased):");
  consoleErrors.forEach((e) => console.log(` - ${e}`));

  console.log("\nGET /whoami WITHOUT credentials: 'include' on the fetch call:");
  console.log(JSON.stringify(results.withoutCredentialsOption));
  console.log("\nGET /whoami WITH credentials: 'include' on the fetch call:");
  console.log(JSON.stringify(results.withCredentialsOption));

  await browser.close();
  apiServer.close();
  frontendServer.close();
}

main().catch((err) => {
  console.error("FAILED:", err.message);
  process.exit(1);
});

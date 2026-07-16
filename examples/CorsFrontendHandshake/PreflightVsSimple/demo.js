// Real proof, using a real headless Chromium browser (Playwright) —
// CORS and preflight are enforced entirely by the BROWSER, not by Node
// or by fetch() run outside one (verified directly while building this
// topic: Node's own fetch() sends no preflight and enforces no CORS
// blocking at all). A real Node script cannot demonstrate real preflight
// behavior on its own — this is why a real browser is used here.
const { chromium } = require("playwright");
const { createApiServer } = require("./api-server");

async function main() {
  const FRONTEND_PORT = 5301;
  const API_PORT = 5302;

  const { app: apiApp, requestLog } = createApiServer(`http://localhost:${FRONTEND_PORT}`);
  const apiServer = apiApp.listen(API_PORT);

  // A minimal real "frontend" page, served from its OWN origin (a
  // different port = a different real origin) — its script makes three
  // real cross-origin fetches to the API above.
  const express = require("express");
  const frontendApp = express();
  frontendApp.get("/", (req, res) => {
    res.send(`<html><body><script>
      window.results = {};
      (async () => {
        const simple = await fetch('http://localhost:${API_PORT}/simple-data');
        window.results.simple = await simple.json();

        const put = await fetch('http://localhost:${API_PORT}/complex-data', { method: 'PUT' });
        window.results.put = await put.json();

        const post = await fetch('http://localhost:${API_PORT}/json-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hello: 'world' }),
        });
        window.results.post = await post.json();

        window.done = true;
      })();
    </script></body></html>`);
  });
  const frontendServer = frontendApp.listen(FRONTEND_PORT);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${FRONTEND_PORT}`);
  await page.waitForFunction(() => window.done === true);
  const results = await page.evaluate(() => window.results);

  console.log("Real results, all three fetched from the browser page's own script:");
  console.log(JSON.stringify(results, null, 2));

  console.log("\nThe REAL sequence of requests that actually arrived at the API server, in order:");
  requestLog.forEach((entry) => console.log(` - ${entry}`));

  console.log("\nNotice: GET /simple-data has NO preflight in front of it. Both PUT /complex-data and POST /json-data have a real OPTIONS request immediately before the real request — the browser asked permission first, on its own, before either one.");

  await browser.close();
  apiServer.close();
  frontendServer.close();
}

main().catch((err) => {
  console.error("FAILED:", err.message);
  process.exit(1);
});

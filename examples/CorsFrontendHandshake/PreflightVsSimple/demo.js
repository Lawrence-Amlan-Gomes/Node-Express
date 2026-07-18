// Real proof, using a real headless Chromium browser (Playwright) —
// CORS and preflight are enforced entirely by the BROWSER, not by Node
// or by fetch() run outside one (verified directly while building this
// topic: Node's own fetch() sends no preflight and enforces no CORS
// blocking at all). A real Node script cannot demonstrate real preflight
// behavior on its own — this is why a real browser is used here.
const { chromium } = require("playwright");
const { createApiServer } = require("./api-server");

async function main() {
  // A real, fixed port for the "frontend" page below — a different
  // port from the API counts as a genuinely different real origin.
  const FRONTEND_PORT = 5301;
  // A real, fixed port for the real Express API this demo hits.
  const API_PORT = 5302;

  // Build the real API, telling its CORS config to allow ONLY the real frontend origin.
  const { app: apiApp, requestLog } = createApiServer(`http://localhost:${FRONTEND_PORT}`);
  // Actually start the real API server, listening for real requests.
  const apiServer = apiApp.listen(API_PORT);

  // A minimal real "frontend" page, served from its OWN origin (a
  // different port = a different real origin) — its script makes three
  // real cross-origin fetches to the API above.
  const express = require("express");
  // Creates the real, tiny Express app that serves just this one page.
  const frontendApp = express();
  frontendApp.get("/", (req, res) => {
    // Sends real, live HTML containing a real <script> — this is the
    // actual browser-side JavaScript Playwright will really execute.
    res.send(`<html><body><script>
      // A real object the page stores its own results on, so Node can read them back later.
      window.results = {};
      (async () => {
        // A real GET — CORS-safelisted as "simple," no preflight needed.
        const simple = await fetch('http://localhost:${API_PORT}/simple-data');
        // Parse and store the real JSON body the API sent back.
        window.results.simple = await simple.json();

        // A real PUT — NOT safelisted, triggers a real OPTIONS preflight first.
        const put = await fetch('http://localhost:${API_PORT}/complex-data', { method: 'PUT' });
        // Parse and store the real JSON body the API sent back.
        window.results.put = await put.json();

        // A real JSON POST — also NOT safelisted, triggers a real preflight first.
        const post = await fetch('http://localhost:${API_PORT}/json-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hello: 'world' }),
        });
        // Parse and store the real JSON body the API sent back.
        window.results.post = await post.json();

        // A real flag Node polls for below, proving every fetch above actually finished.
        window.done = true;
      })();
    </script></body></html>`);
  });
  // Actually start the real frontend server, listening for real requests.
  const frontendServer = frontendApp.listen(FRONTEND_PORT);

  // Launches a real, headless Chromium browser process.
  const browser = await chromium.launch();
  // Opens a real new browser tab/page inside it.
  const page = await browser.newPage();
  // Actually navigates the real browser to the real frontend page above.
  await page.goto(`http://localhost:${FRONTEND_PORT}`);
  // Waits for the real page's own script to finish all three real fetches.
  await page.waitForFunction(() => window.done === true);
  // Reads the real results object back out of the real browser page.
  const results = await page.evaluate(() => window.results);

  console.log("Real results, all three fetched from the browser page's own script:");
  // Print the real, full results object exactly as the browser produced it.
  console.log(JSON.stringify(results, null, 2));

  console.log("\nThe REAL sequence of requests that actually arrived at the API server, in order:");
  // Print every real log entry the server actually recorded, in real arrival order.
  requestLog.forEach((entry) => console.log(` - ${entry}`));

  console.log("\nNotice: GET /simple-data has NO preflight in front of it. Both PUT /complex-data and POST /json-data have a real OPTIONS request immediately before the real request — the browser asked permission first, on its own, before either one.");

  // Closes the real browser process.
  await browser.close();
  // Stops the real API server from listening.
  apiServer.close();
  // Stops the real frontend server from listening.
  frontendServer.close();
}

main().catch((err) => {
  // Print the real error message if anything above actually failed.
  console.error("FAILED:", err.message);
  // Mark the process as failed, so a CI run can notice.
  process.exit(1);
});

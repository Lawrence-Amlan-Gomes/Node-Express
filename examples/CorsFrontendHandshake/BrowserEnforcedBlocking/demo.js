// Real proof, using a real headless Chromium browser, that CORS
// blocking is entirely a CLIENT-side decision — the server always
// finishes and answers; the question is only whether the browser lets
// the page's own JS see that answer.
const { chromium } = require("playwright");
const express = require("express");
const { createApiServer } = require("./api-server");

async function main() {
  // A real, fixed port for the "frontend" page below — a different
  // port from the API counts as a genuinely different real origin.
  const FRONTEND_PORT = 5311;
  // A real, fixed port for the real Express API this demo hits.
  const API_PORT = 5312;

  // Build the real API, telling its per-route CORS configs to allow ONLY the real frontend origin.
  const apiServer = createApiServer(`http://localhost:${FRONTEND_PORT}`).listen(API_PORT);

  // Creates the real, tiny Express app that serves just this one page.
  const frontendApp = express();
  frontendApp.get("/", (req, res) => {
    // Sends real, live HTML containing a real <script> — this is the
    // actual browser-side JavaScript Playwright will really execute.
    res.send(`<html><body><script>
      // A real object the page stores its own results on, so Node can read them back later.
      window.results = {};
      (async () => {
        try {
          // A real fetch with NO CORS headers coming back — this either
          // succeeds (server-side) or gets blocked (browser-side).
          const noCors = await fetch('http://localhost:${API_PORT}/no-cors');
          // Reached here only if the browser actually let the page read the response.
          window.results.noCors = { ok: true, data: await noCors.json() };
        } catch (e) {
          // Reached here if the browser genuinely blocked reading the response — the real error message.
          window.results.noCors = { ok: false, error: e.message };
        }

        try {
          // A real fetch to the route that DOES send the right CORS headers back.
          const withCors = await fetch('http://localhost:${API_PORT}/with-cors');
          // The browser really does allow this one through.
          window.results.withCors = { ok: true, data: await withCors.json() };
        } catch (e) {
          // Kept for symmetry — this branch is not expected to run for this route.
          window.results.withCors = { ok: false, error: e.message };
        }

        // Set a real cookie on the API's own origin first.
        await fetch('http://localhost:${API_PORT}/set-cookie', { credentials: 'include' });

        // Request 1: default fetch, no credentials option — the cookie
        // is NOT sent, even though the browser already has it stored
        // for the API's origin.
        const withoutCredsRes = await fetch('http://localhost:${API_PORT}/whoami');
        // Parse and store the real JSON body the API sent back.
        window.results.withoutCredentialsOption = await withoutCredsRes.json();

        // Request 2: credentials: 'include' — the cookie IS sent, since
        // both the client opts in AND the server allows it.
        const withCredsRes = await fetch('http://localhost:${API_PORT}/whoami', { credentials: 'include' });
        // Parse and store the real JSON body the API sent back.
        window.results.withCredentialsOption = await withCredsRes.json();

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
  // A real array this Node process fills in as the browser reports its own console errors.
  const consoleErrors = [];
  page.on("console", (msg) => {
    // Only real "error"-level console messages are kept — this is what
    // captures the browser's own real CORS-blocked error text.
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  // Actually navigates the real browser to the real frontend page above.
  await page.goto(`http://localhost:${FRONTEND_PORT}`);
  // Waits for the real page's own script to finish every real fetch above.
  await page.waitForFunction(() => window.done === true);
  // Reads the real results object back out of the real browser page.
  const results = await page.evaluate(() => window.results);

  console.log("GET /no-cors (server sends NO CORS headers at all):");
  // Print the real outcome — whether the browser actually let the page read it.
  console.log(JSON.stringify(results.noCors));
  console.log("\nGET /with-cors (server allows this exact origin):");
  // Print the real outcome — the browser really does allow this one.
  console.log(JSON.stringify(results.withCors));

  console.log("\nReal browser console error, captured directly (this is the actual, real message Chromium produces — not paraphrased):");
  // Print every real console error the browser actually produced.
  consoleErrors.forEach((e) => console.log(` - ${e}`));

  console.log("\nGET /whoami WITHOUT credentials: 'include' on the fetch call:");
  // Print the real result — proving the cookie genuinely was not sent.
  console.log(JSON.stringify(results.withoutCredentialsOption));
  console.log("\nGET /whoami WITH credentials: 'include' on the fetch call:");
  // Print the real result — proving the cookie genuinely was sent this time.
  console.log(JSON.stringify(results.withCredentialsOption));

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

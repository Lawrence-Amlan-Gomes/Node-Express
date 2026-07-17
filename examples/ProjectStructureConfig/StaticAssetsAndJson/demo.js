// Proves both real things landing on the same app: a real static HTML file
// served with no route handler, and a real JSON API route, distinguished
// by their real Content-Type headers and real bodies.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
// Every fetch() call below reuses this same base URL.
const base = `http://localhost:${port}`;

// The actual real HTTP request — hits public/index.html via express.static().
const pageRes = await fetch(`${base}/`);
// Read the real raw text body — an HTML file, not JSON, so .text() not .json().
const pageBody = await pageRes.text();
// Print the real status and content-type — proof it's a real HTML file.
console.log(`GET / => status ${pageRes.status}, content-type: ${pageRes.headers.get("content-type")}`);
// Pull the real <h1> text straight out of the real HTML that came back.
const heading = pageBody.match(/<h1>(.*)<\/h1>/)?.[1];
// Print the real heading text — proof this came from the real file on disk.
console.log(`Body's <h1> (a real file from public/index.html, unmodified): "${heading}"`);

// The actual real HTTP request — this path has no matching file, so it
// falls through to the real /api/status route handler instead.
const apiRes = await fetch(`${base}/api/status`);
// Parse the real JSON body the route handler sent back.
const apiData = await apiRes.json();
// Print the real status and content-type — proof it's real JSON, not HTML.
console.log(`\nGET /api/status => status ${apiRes.status}, content-type: ${apiRes.headers.get("content-type")}`);
// Print the real JSON body itself.
console.log(`Body (real JSON from our own route handler): ${JSON.stringify(apiData)}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();

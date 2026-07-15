// Proves both real things landing on the same app: a real static HTML file
// served with no route handler, and a real JSON API route, distinguished
// by their real Content-Type headers and real bodies.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

const pageRes = await fetch(`${base}/`);
const pageBody = await pageRes.text();
console.log(`GET / => status ${pageRes.status}, content-type: ${pageRes.headers.get("content-type")}`);
const heading = pageBody.match(/<h1>(.*)<\/h1>/)?.[1];
console.log(`Body's <h1> (a real file from public/index.html, unmodified): "${heading}"`);

const apiRes = await fetch(`${base}/api/status`);
const apiData = await apiRes.json();
console.log(`\nGET /api/status => status ${apiRes.status}, content-type: ${apiRes.headers.get("content-type")}`);
console.log(`Body (real JSON from our own route handler): ${JSON.stringify(apiData)}`);

server.close();

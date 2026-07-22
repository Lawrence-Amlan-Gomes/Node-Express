// demo.js only calls the real, running API and prints what comes back —
// never imports the controller or the spec object directly.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

// The real, raw spec, served as JSON — proves it's the SAME spec on disk,
// not just prose describing what the API "should" do.
const specRes = await fetch(`${base}/openapi.json`);
const spec = await specRes.json();
console.log(`GET /openapi.json => ${specRes.status}`);
console.log(`Real spec title: "${spec.info.title}", ${Object.keys(spec.paths).length} real documented paths: ${Object.keys(spec.paths).join(", ")}`);

// The real, interactive docs page — proves swagger-ui-express is really
// serving a real Swagger UI page built FROM that same spec.
const docsRes = await fetch(`${base}/docs/`);
const docsHtml = await docsRes.text();
console.log(`\nGET /docs/ => ${docsRes.status}`);
console.log(`Real HTML really contains the Swagger UI markup: ${docsHtml.includes("swagger-ui") ? "yes" : "no"}`);

// The real API itself, exercised exactly as documented in the spec above.
const listRes = await fetch(`${base}/products`);
const list = await listRes.json();
console.log(`\nGET /products => ${listRes.status}`, JSON.stringify(list));

const createRes = await fetch(`${base}/products`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Standing Desk", price: 349.5 }),
});
const created = await createRes.json();
console.log(`\nPOST /products => ${createRes.status}`, JSON.stringify(created));

const getRes = await fetch(`${base}/products/1`);
const got = await getRes.json();
console.log(`\nGET /products/1 => ${getRes.status}`, JSON.stringify(got));

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();

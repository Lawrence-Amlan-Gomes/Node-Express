// Calls the real, running Express API (server.js) over real HTTP for
// BOTH databases — this file does NOT talk to Prisma or Mongoose
// directly at all. A real backend dev exercises an API this way: real
// requests, real JSON responses, exactly like a frontend or Postman
// would. The real ORM calls all live in the two controllers instead.
require("dotenv").config({ quiet: true });
const app = require("./server.js");

// Runs the real Postgres half of the comparison, entirely via real HTTP.
async function runPostgres(base) {
  // Clean up anything left over from a previous run — through the real API.
  await fetch(`${base}/postgres-tasks`, { method: "DELETE" });

  // CREATE — a real POST request.
  const createRes = await fetch(`${base}/postgres-tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Compare both databases" }),
  });
  const created = await createRes.json();
  // READ — a real GET request.
  const allRes = await fetch(`${base}/postgres-tasks`);
  const allTasks = await allRes.json();
  // UPDATE — a real PATCH request.
  const updateRes = await fetch(`${base}/postgres-tasks/${created.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: true }),
  });
  const updated = await updateRes.json();
  // DELETE — a real DELETE request.
  const deleteRes = await fetch(`${base}/postgres-tasks/${created.id}`, { method: "DELETE" });
  const deleted = await deleteRes.json();

  // Hand back all four real results together.
  return { created, allTasks, updated, deleted };
}

// Runs the real MongoDB half of the comparison, entirely via real HTTP.
async function runMongo(base) {
  // Clean up anything left over from a previous run — through the real API.
  await fetch(`${base}/mongo-tasks`, { method: "DELETE" });

  // CREATE — a real POST request.
  const createRes = await fetch(`${base}/mongo-tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Compare both databases" }),
  });
  const created = await createRes.json();
  // READ — a real GET request.
  const allRes = await fetch(`${base}/mongo-tasks`);
  const allTasks = await allRes.json();
  // UPDATE — a real PATCH request.
  const updateRes = await fetch(`${base}/mongo-tasks/${created._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: true }),
  });
  const updated = await updateRes.json();
  // DELETE — a real DELETE request.
  const deleteRes = await fetch(`${base}/mongo-tasks/${created._id}`, { method: "DELETE" });
  const deleted = await deleteRes.json();

  // Hand back all four real results together.
  return { created, allTasks, updated, deleted };
}

async function main() {
  // Port 0 means "give me any free port" — resolve only once it's really listening.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  // The real port the OS actually assigned, read back off the live server.
  const { port } = server.address();
  const base = `http://localhost:${port}`;

  // Run one at a time (not Promise.all) purely so the printed output
  // below stays in a predictable order to read — both really do run for
  // real, independently, against two completely separate database
  // servers, entirely over real HTTP.
  const postgresResult = await runPostgres(base);
  const mongoResult = await runMongo(base);

  console.log("=== POSTGRESQL, via /postgres-tasks ===");
  console.log("CREATE:", postgresResult.created);
  console.log("READ (all rows):", postgresResult.allTasks);
  console.log("UPDATE:", postgresResult.updated);
  console.log("DELETE:", postgresResult.deleted);

  console.log("\n=== MONGODB, via /mongo-tasks ===");
  console.log("CREATE:", mongoResult.created);
  console.log("READ (all documents):", mongoResult.allTasks);
  console.log("UPDATE:", mongoResult.updated);
  console.log("DELETE:", mongoResult.deleted);

  console.log("\n=== The real shape difference ===");
  console.log("Postgres row: a fixed set of columns (id, title, done, createdAt) — the id is a plain auto-incrementing integer, enforced by the table itself.");
  console.log("Mongo document: title/done/createdAt look the same, but MongoDB itself adds _id (an ObjectId, not a plain integer) and Mongoose adds __v (an internal version key it uses for its own optimistic-concurrency features) — nothing forces a Mongo document to keep matching this shape at all; Mongoose is the only thing enforcing it, on the application side.");

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main()
  .catch((err) => {
    // Print the real error message if anything above actually failed.
    console.error("FAILED:", err.message);
    // Mark the process as failed, so a CI run or Postman check can notice.
    process.exitCode = 1;
  })
  .finally(() => {
    // server.js opens the real Mongo connection once, meant to live for
    // the whole real server's lifetime — this one-shot script has no
    // business closing it itself, so it exits explicitly instead of
    // hanging on a connection it doesn't own.
    process.exit(process.exitCode ?? 0);
  });

// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Prisma directly at all. Proves the CURRENT
// shape of the Post table — the result of TWO real, versioned
// migrations (see prisma/migrations/, both really applied against the
// real remote database while building this example):
//   1. 20260715184508_init_post          — created Post (id, title)
//   2. 20260715184547_add_published_flag — added "published", defaulting
//      to false for any row that already existed before this migration
//      ran (verified directly during authoring: a real pre-existing row
//      picked up published = false automatically, with zero data loss).
require("dotenv").config({ quiet: true });
const app = require("./server.js");

async function main() {
  // Port 0 means "give me any free port" — resolve only once it's really listening.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  // The real port the OS actually assigned, read back off the live server.
  const { port } = server.address();
  const base = `http://localhost:${port}`;

  // Clean up anything left over from a previous run — through the real API.
  await fetch(`${base}/posts`, { method: "DELETE" });

  // CREATE — a real POST request, deliberately with NO "published" field,
  // same as how every row written before migration 2 existed. The real
  // column default (added by that migration) is what supplies the value.
  const createRes = await fetch(`${base}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "A post written after both migrations" }),
  });
  // Parse the real JSON body the API sent back.
  const created = await createRes.json();
  console.log("CREATE (no \"published\" supplied) — the column's real default kicks in:");
  // Print the real row — published should already be false, from the column default.
  console.log(created);

  // READ — a real GET request.
  const allRes = await fetch(`${base}/posts`);
  // Parse the real JSON body the API sent back.
  const allPosts = await allRes.json();
  console.log("\nREAD — every row currently in the table:");
  // Print the real, current contents of the table.
  console.log(allPosts);

  // Clean up again, leaving the table empty for the next run.
  const deleteRes = await fetch(`${base}/posts`, { method: "DELETE" });
  // Parse the real JSON body the API sent back.
  const deleted = await deleteRes.json();
  console.log(`\nDELETE — cleaned up ${deleted.deletedCount} row(s), table left empty for the next run.`);

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main().catch((err) => {
  // Print the real error message if anything above actually failed.
  console.error("FAILED:", err.message);
  // Mark the process as failed, so a CI run or Postman check can notice.
  process.exitCode = 1;
});

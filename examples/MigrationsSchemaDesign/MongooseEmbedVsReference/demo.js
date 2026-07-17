// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Mongoose directly at all. Real proof of the
// actual cost difference between MongoDB's two real schema design
// options, fetching the SAME logical thing both ways: one post, plus
// all of its comments.
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
  await fetch(`${base}/posts-embedded`, { method: "DELETE" });
  await fetch(`${base}/posts-referenced`, { method: "DELETE" });

  // CREATE (embedded) — one real POST, comments included in the same request.
  const createEmbeddedRes = await fetch(`${base}/posts-embedded`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Why Node is single-threaded",
      comments: [{ body: "Great explanation!" }, { body: "Finally makes sense." }],
    }),
  });
  // Parse the real JSON body the API sent back.
  const createdEmbedded = await createEmbeddedRes.json();
  // READ (embedded) — a real GET, by the real id the CREATE step returned.
  const embeddedRes = await fetch(`${base}/posts-embedded/${createdEmbedded._id}`);
  // Parse the real JSON body the API sent back.
  const embedded = await embeddedRes.json();
  console.log("=== EMBEDDED (one document, comments array inside it) ===");
  // Print the real fetched document.
  console.log(embedded.post);
  // Print the real, measured query count for this approach.
  console.log(`Real queries needed to fetch the post + its comments: ${embedded.queryCount}`);

  // CREATE (referenced) — one real POST; the controller does two real inserts.
  const createReferencedRes = await fetch(`${base}/posts-referenced`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Why Node is single-threaded",
      comments: [{ body: "Great explanation!" }, { body: "Finally makes sense." }],
    }),
  });
  // Parse the real JSON body the API sent back.
  const createdReferenced = await createReferencedRes.json();
  // READ (referenced) — a real GET, by the real id the CREATE step returned.
  const referencedRes = await fetch(`${base}/posts-referenced/${createdReferenced._id}`);
  // Parse the real JSON body the API sent back.
  const referenced = await referencedRes.json();
  console.log("\n=== REFERENCED (post document + separate comments collection) ===");
  // Print the real reassembled result.
  console.log(referenced.post);
  // Print the real, measured query count for this approach.
  console.log(`Real queries needed to fetch the post + its comments: ${referenced.queryCount}`);

  console.log("\n=== The real trade-off ===");
  // Spell out, in plain words, the real trade-off the two measured counts above just proved.
  console.log("Embedding wins here: 1 query instead of 2, because the comments never left the post document. But an embedded array keeps growing with the post forever — MongoDB caps a single document at 16MB, a real hard limit — so embedding stops being safe for something like \"every comment ever,\" on a popular post, over years. Referencing avoids that growth problem entirely (comments live in their own collection, no size ceiling tied to the post), at the real cost of needing a second query every time you want them together.");

  // Clean up after this run — a real shared database, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await fetch(`${base}/posts-embedded`, { method: "DELETE" });
  await fetch(`${base}/posts-referenced`, { method: "DELETE" });

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

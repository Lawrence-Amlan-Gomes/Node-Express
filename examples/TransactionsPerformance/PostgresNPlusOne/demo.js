// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Prisma directly at all. The N+1 query problem:
// fetching a list of N things, then running ONE MORE query per item to
// get each item's related data — N+1 total real queries instead of a
// small, fixed number. This counts the REAL SQL queries Prisma actually
// sends, measured server-side and returned right in the response.
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

  // Seed fresh real authors and posts — through the real API, not Prisma directly.
  await fetch(`${base}/posts/reset`, { method: "POST" });

  // THE NAIVE VERSION — a real GET request.
  const naiveRes = await fetch(`${base}/posts/naive`);
  // Parse the real JSON body the API sent back.
  const naive = await naiveRes.json();
  console.log("NAIVE (findMany + a query per post):");
  // Print the real, reassembled result.
  console.log(naive.posts);
  // Print the real, measured query count.
  console.log(`Real queries sent: ${naive.queryCount}`);

  // THE FIX — a real GET request.
  const optimizedRes = await fetch(`${base}/posts/optimized`);
  // Parse the real JSON body the API sent back.
  const optimized = await optimizedRes.json();
  console.log("\nWITH include: { author: true } (Prisma's own N+1 fix):");
  // Print the real, reassembled result — same shape as the naive version above.
  console.log(optimized.posts);
  // Print the real, measured query count.
  console.log(`Real queries sent: ${optimized.queryCount}`);

  // Spell out, in plain words, the real gap the two measured counts above just proved.
  console.log(`\nSame result, ${naive.queryCount} queries vs ${optimized.queryCount} — and the gap only widens as the number of posts grows (naive keeps adding 1 query per post; include stays at 2, always).`);

  // Clean up after this run — a real shared database, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await fetch(`${base}/posts`, { method: "DELETE" });

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main().catch((err) => {
  // Print the real error message if anything above actually failed.
  console.error("FAILED:", err.message);
  // Mark the process as failed, so a CI run or Postman check can notice.
  process.exitCode = 1;
});

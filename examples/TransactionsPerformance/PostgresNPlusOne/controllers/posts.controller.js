// The real Prisma calls (and the real query-count instrumentation) live
// here — the routes file never talks to Prisma directly, only this
// controller does.
const { PrismaClient } = require("@prisma/client");

// Real query-logging turned on — this is what makes the counts below honest.
const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });

// A real, running counter — incremented once per real query Prisma sends.
let queryCount = 0;
// Registers a real listener on Prisma's own "query" event.
prisma.$on("query", () => {
  queryCount++;
});

// Handles POST /posts/reset — clears both tables and seeds fresh real
// authors/posts, so every demo run (or Postman try) starts from the
// exact same known state.
async function resetPosts(req, res) {
  // Clean up anything left over from a previous run first, in both tables.
  await prisma.post.deleteMany();
  await prisma.author.deleteMany();

  // Insert two real authors.
  const ada = await prisma.author.create({ data: { name: "Ada Lovelace" } });
  const grace = await prisma.author.create({ data: { name: "Grace Hopper" } });
  // Insert three real posts, two by Ada, one by Grace.
  await prisma.post.create({ data: { title: "On Analytical Engines", authorId: ada.id } });
  await prisma.post.create({ data: { title: "More on Analytical Engines", authorId: ada.id } });
  await prisma.post.create({ data: { title: "COBOL and Compilers", authorId: grace.id } });

  res.status(201).json({ authors: [ada, grace] });
}

// Handles GET /posts/naive — fetches every post (1 query), then loops
// and fetches each post's author ONE AT A TIME (1 more query per post)
// — for 3 posts, that's really, verifiably 1 + 3 = 4 real queries.
async function listPostsNaive(req, res) {
  // Reset the counter right before the section being measured.
  queryCount = 0;
  // Real query #1 — every post.
  const posts = await prisma.post.findMany();
  const result = [];
  for (const post of posts) {
    // One more real query, per post, inside the loop — the N+1 bug itself.
    const author = await prisma.author.findUnique({ where: { id: post.authorId } });
    result.push({ post: post.title, author: author.name });
  }
  // Capture the real, final count before it gets reset by the next request.
  res.json({ posts: result, queryCount });
}

// Handles GET /posts/optimized — include tells Prisma to fetch the
// related authors too. This is NOT a single SQL JOIN, verified directly
// by watching Prisma's own query log — it's 2 real, fixed queries no
// matter how many posts there are: one for the posts, one batched
// "WHERE id IN (...)" query that grabs every needed author at once.
async function listPostsOptimized(req, res) {
  // Reset the counter right before this section's own real queries.
  queryCount = 0;
  // One real call, both real queries happen automatically inside it.
  const posts = await prisma.post.findMany({ include: { author: true } });
  const result = posts.map((p) => ({ post: p.title, author: p.author.name }));
  // Capture the real, final count for this section.
  res.json({ posts: result, queryCount });
}

// Handles DELETE /posts — clears both real tables, with no reseed. Used
// by demo.js to leave them exactly as found (empty) when it's done,
// since this is a real shared database, not a throwaway local one.
async function deleteAllPosts(req, res) {
  const posts = await prisma.post.deleteMany();
  const authors = await prisma.author.deleteMany();
  res.json({ deletedPosts: posts.count, deletedAuthors: authors.count });
}

module.exports = { resetPosts, listPostsNaive, listPostsOptimized, deleteAllPosts };

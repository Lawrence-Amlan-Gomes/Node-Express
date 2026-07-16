// The N+1 query problem: fetching a list of N things, then running ONE
// MORE query per item to get each item's related data — N+1 total real
// queries instead of a small, fixed number. This counts the REAL SQL
// queries Prisma actually sends, via its own query-logging event, for
// both the naive version and the fixed version.
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });

let queryCount = 0;
prisma.$on("query", () => {
  queryCount++;
});

async function main() {
  await prisma.post.deleteMany();
  await prisma.author.deleteMany();

  const ada = await prisma.author.create({ data: { name: "Ada Lovelace" } });
  const grace = await prisma.author.create({ data: { name: "Grace Hopper" } });
  await prisma.post.create({ data: { title: "On Analytical Engines", authorId: ada.id } });
  await prisma.post.create({ data: { title: "More on Analytical Engines", authorId: ada.id } });
  await prisma.post.create({ data: { title: "COBOL and Compilers", authorId: grace.id } });

  // THE NAIVE VERSION: fetch every post (1 query), then loop and fetch
  // each post's author ONE AT A TIME (1 more query per post) — for 3
  // posts, that's really, verifiably 1 + 3 = 4 real queries.
  queryCount = 0;
  const posts = await prisma.post.findMany();
  const naiveResult = [];
  for (const post of posts) {
    const author = await prisma.author.findUnique({ where: { id: post.authorId } });
    naiveResult.push({ post: post.title, author: author.name });
  }
  const naiveQueryCount = queryCount;
  console.log("NAIVE (findMany + a query per post):");
  console.log(naiveResult);
  console.log(`Real queries sent: ${naiveQueryCount}`);

  // THE FIX: include tells Prisma to fetch the related authors too. This
  // is NOT a single SQL JOIN, verified directly by watching Prisma's own
  // query log — it's 2 real, fixed queries no matter how many posts
  // there are: one for the posts, one batched "WHERE id IN (...)" query
  // that grabs every needed author at once.
  queryCount = 0;
  const postsWithAuthors = await prisma.post.findMany({ include: { author: true } });
  const includeQueryCount = queryCount;
  console.log("\nWITH include: { author: true } (Prisma's own N+1 fix):");
  console.log(postsWithAuthors.map((p) => ({ post: p.title, author: p.author.name })));
  console.log(`Real queries sent: ${includeQueryCount}`);

  console.log(`\nSame result, ${naiveQueryCount} queries vs ${includeQueryCount} — and the gap only widens as the number of posts grows (naive keeps adding 1 query per post; include stays at 2, always).`);

  await prisma.post.deleteMany();
  await prisma.author.deleteMany();
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Proves the CURRENT shape of the Post table — the result of TWO real,
// versioned migrations (see prisma/migrations/, both really applied
// against the real remote database while building this example):
//   1. 20260715184508_init_post          — created Post (id, title)
//   2. 20260715184547_add_published_flag — added "published", defaulting
//      to false for any row that already existed before this migration
//      ran (verified directly during authoring: a real pre-existing row
//      picked up published = false automatically, with zero data loss).
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();

  // Deliberately NOT passing "published" here — same as how every row
  // written before migration 2 existed. The real column default (added
  // by that migration) is what supplies the value below, not this code.
  const created = await prisma.post.create({
    data: { title: "A post written after both migrations" },
  });
  console.log("CREATE (no \"published\" supplied) — the column's real default kicks in:");
  console.log(created);

  const allPosts = await prisma.post.findMany();
  console.log("\nREAD — every row currently in the table:");
  console.log(allPosts);

  const deleted = await prisma.post.deleteMany();
  console.log(`\nDELETE — cleaned up ${deleted.count} row(s), table left empty for the next run.`);
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

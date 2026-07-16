// Real CRUD (Create, Read, Update, Delete) against a REAL remote
// PostgreSQL database, using Prisma as the ORM (Object-Relational
// Mapper — a library that lets you call real JS functions like
// prisma.task.create() instead of writing raw SQL strings by hand).
// { quiet: true } just silences dotenv's own random startup tip banner —
// it has nothing to do with the real database work below.
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");

// PrismaClient is the real, generated (by "prisma generate", which runs
// automatically after "npm install" here) client for THIS schema. It
// already knows about the "Task" model from schema.prisma, with full
// autocomplete/type info in a TS project.
const prisma = new PrismaClient();

async function main() {
  // This demo cleans up after itself every run (so repeatedly viewing
  // this page in the app doesn't pile up rows in a real shared database
  // forever) — start by clearing out anything from a previous run.
  await prisma.task.deleteMany();

  // CREATE — a real INSERT, run for real against the real database.
  const created = await prisma.task.create({
    data: { title: "Write the Postgres + Prisma demo" },
  });
  console.log("CREATE — inserted a real row:");
  console.log(created);

  // READ — a real SELECT. findMany() returns every row in the table.
  const allTasks = await prisma.task.findMany();
  console.log("\nREAD — every row currently in the table:");
  console.log(allTasks);

  // UPDATE — a real UPDATE, by primary key (id).
  const updated = await prisma.task.update({
    where: { id: created.id },
    data: { done: true },
  });
  console.log("\nUPDATE — same row, done flipped to true:");
  console.log(updated);

  // DELETE — a real DELETE, by primary key. Leaves the table exactly as
  // it was found (empty) so the next run starts clean too.
  const deleted = await prisma.task.delete({ where: { id: created.id } });
  console.log("\nDELETE — the row is now gone:");
  console.log(deleted);
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    // Always close the real database connection when done, whether the
    // demo succeeded or failed — otherwise the process hangs open.
    await prisma.$disconnect();
  });

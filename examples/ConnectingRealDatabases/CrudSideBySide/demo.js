// The SAME real CRUD operations (Create, Read, Update, Delete), run for
// real against TWO different real databases in the same script — a
// direct, side-by-side proof of how the same job looks in each.
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");
const mongoose = require("mongoose");
const MongoTask = require("./mongo-task-model");

const prisma = new PrismaClient();

async function runPostgres() {
  await prisma.task.deleteMany();

  const created = await prisma.task.create({ data: { title: "Compare both databases" } });
  const allTasks = await prisma.task.findMany();
  const updated = await prisma.task.update({ where: { id: created.id }, data: { done: true } });
  const deleted = await prisma.task.delete({ where: { id: created.id } });

  return { created, allTasks, updated, deleted };
}

async function runMongo() {
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
  await MongoTask.deleteMany({});

  const created = await MongoTask.create({ title: "Compare both databases" });
  const allTasks = await MongoTask.find();
  const updated = await MongoTask.findByIdAndUpdate(created._id, { done: true }, { new: true });
  const deleted = await MongoTask.findByIdAndDelete(created._id);

  return {
    created: created.toObject(),
    allTasks: allTasks.map((t) => t.toObject()),
    updated: updated.toObject(),
    deleted: deleted.toObject(),
  };
}

async function main() {
  // Run one at a time (not Promise.all) purely so the printed output
  // below stays in a predictable order to read — both really do run for
  // real, independently, against two completely separate database
  // servers.
  const postgresResult = await runPostgres();
  const mongoResult = await runMongo();

  console.log("=== POSTGRESQL, via Prisma ===");
  console.log("CREATE:", postgresResult.created);
  console.log("READ (all rows):", postgresResult.allTasks);
  console.log("UPDATE:", postgresResult.updated);
  console.log("DELETE:", postgresResult.deleted);

  console.log("\n=== MONGODB, via Mongoose ===");
  console.log("CREATE:", mongoResult.created);
  console.log("READ (all documents):", mongoResult.allTasks);
  console.log("UPDATE:", mongoResult.updated);
  console.log("DELETE:", mongoResult.deleted);

  console.log("\n=== The real shape difference ===");
  console.log("Postgres row: a fixed set of columns (id, title, done, createdAt) — the id is a plain auto-incrementing integer, enforced by the table itself.");
  console.log("Mongo document: title/done/createdAt look the same, but MongoDB itself adds _id (an ObjectId, not a plain integer) and Mongoose adds __v (an internal version key it uses for its own optimistic-concurrency features) — nothing forces a Mongo document to keep matching this shape at all; Mongoose is the only thing enforcing it, on the application side.");
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await mongoose.disconnect();
  });

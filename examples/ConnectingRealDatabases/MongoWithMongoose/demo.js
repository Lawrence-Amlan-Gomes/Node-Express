// Real CRUD (Create, Read, Update, Delete) against a REAL remote
// MongoDB database (a MongoDB Atlas cluster), using Mongoose.
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const Task = require("./task-model");

async function main() {
  // connect() opens a real network connection to the real Atlas cluster,
  // using the connection string from .env (never hardcoded, never
  // committed — see .env.example for the placeholder shape).
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);

  // This demo cleans up after itself every run (so repeatedly viewing
  // this page in the app doesn't pile up documents in a real shared
  // database forever) — start by clearing out anything from a previous run.
  await Task.deleteMany({});

  // CREATE — a real document insert.
  const created = await Task.create({ title: "Write the Mongo + Mongoose demo" });
  console.log("CREATE — inserted a real document:");
  console.log(created.toObject());

  // READ — find() with no filter returns every document in the collection.
  const allTasks = await Task.find();
  console.log("\nREAD — every document currently in the collection:");
  console.log(allTasks.map((t) => t.toObject()));

  // UPDATE — a real update, by MongoDB's own document id (_id). The
  // { new: true } option asks Mongoose to return the document AFTER the
  // update, not the stale one from before.
  const updated = await Task.findByIdAndUpdate(
    created._id,
    { done: true },
    { new: true },
  );
  console.log("\nUPDATE — same document, done flipped to true:");
  console.log(updated.toObject());

  // DELETE — a real delete, by id. Leaves the collection exactly as it
  // was found (empty) so the next run starts clean too.
  const deleted = await Task.findByIdAndDelete(created._id);
  console.log("\nDELETE — the document is now gone:");
  console.log(deleted.toObject());
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    // Always close the real database connection when done, whether the
    // demo succeeded or failed — otherwise the process hangs open.
    await mongoose.disconnect();
  });

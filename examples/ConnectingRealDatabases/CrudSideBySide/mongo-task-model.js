// Same real Mongoose shape as MongoWithMongoose's model, but a
// DIFFERENT real collection ("learning_tasks_side_by_side"), not a
// reused one. Confirmed 2026-07-16: two mini-projects' demo scripts both
// writing to the literal same collection is a real concurrency bug —
// Next.js renders a page's Server Components concurrently, not one at a
// time, so this section's demo.js and MongoWithMongoose's demo.js could
// run at the same real moment, and one's cleanup step could wipe out a
// document the other was still mid-update/delete on. See
// build-conventions.md for the full story.
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Pins this section's own, separate real collection name — deliberately
// different from MongoWithMongoose's "learning_tasks", per the concurrency
// note above.
module.exports = mongoose.model("Task", taskSchema, "learning_tasks_side_by_side");

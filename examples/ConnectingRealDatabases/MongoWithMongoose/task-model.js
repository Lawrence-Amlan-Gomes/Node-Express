// Mongoose is an ODM (Object-Document Mapper — the document-database
// equivalent of Prisma's "ORM" label) for MongoDB. A "schema" here is
// NOT enforced by MongoDB itself the way a Postgres table's columns
// are — MongoDB will happily store a document that doesn't match this
// shape at all. The enforcement is purely on the JS side, by Mongoose,
// when you go through this model. That's the real, practical trade-off
// between the two: Prisma's shape is enforced by the database; this
// shape is enforced by the application code using it.
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// The 3rd argument pins the real collection name to "learning_tasks"
// (Mongoose would otherwise guess "tasks" from the model name "Task").
// Being explicit keeps this demo's data clearly separated from any
// other real collection already living in this same shared database.
module.exports = mongoose.model("Task", taskSchema, "learning_tasks");

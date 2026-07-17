// This is where the real Mongoose calls live — the routes file never
// talks to Mongoose directly, only this controller does.
const Task = require("../task-model");

// Handles POST /tasks.
async function createTask(req, res) {
  // A real document insert.
  const created = await Task.create({ title: req.body.title });
  // 201 means "created" — the correct real status code for a successful POST.
  res.status(201).json(created.toObject());
}

// Handles GET /tasks.
async function listTasks(req, res) {
  // find() with no filter returns every real document in the collection.
  const tasks = await Task.find();
  // Convert every real document to a plain object before sending it back.
  res.json(tasks.map((t) => t.toObject()));
}

// Handles PATCH /tasks/:id.
async function updateTask(req, res) {
  // A real update, by MongoDB's own document id (_id). { new: true } asks
  // Mongoose to return the document AFTER the update, not the stale one.
  const updated = await Task.findByIdAndUpdate(req.params.id, { done: req.body.done }, { new: true });
  res.json(updated.toObject());
}

// Handles DELETE /tasks/:id.
async function deleteTask(req, res) {
  // A real delete, by id.
  const deleted = await Task.findByIdAndDelete(req.params.id);
  res.json(deleted.toObject());
}

// Handles DELETE /tasks — clears every real document. Not a typical REST
// endpoint on a real production API, but a real, honest one here: this
// project's demo.js needs a real way to reset the collection between
// runs, through the API itself, instead of reaching around it into Mongoose.
async function deleteAllTasks(req, res) {
  // A real bulk delete — deletedCount tells the caller how many documents were removed.
  const result = await Task.deleteMany({});
  res.json({ deletedCount: result.deletedCount });
}

module.exports = { createTask, listTasks, updateTask, deleteTask, deleteAllTasks };

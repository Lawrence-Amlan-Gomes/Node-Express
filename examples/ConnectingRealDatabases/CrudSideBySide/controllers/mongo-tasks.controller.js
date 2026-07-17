// The real Mongoose calls for the MongoDB half of this comparison — the
// routes file never talks to Mongoose directly, only this controller does.
const MongoTask = require("../mongo-task-model");

// Handles POST /mongo-tasks.
async function createTask(req, res) {
  // A real document insert.
  const created = await MongoTask.create({ title: req.body.title });
  res.status(201).json(created.toObject());
}

// Handles GET /mongo-tasks.
async function listTasks(req, res) {
  // find() with no filter returns every real document in the collection.
  const tasks = await MongoTask.find();
  res.json(tasks.map((t) => t.toObject()));
}

// Handles PATCH /mongo-tasks/:id.
async function updateTask(req, res) {
  // A real update, by MongoDB's own document id (_id).
  const updated = await MongoTask.findByIdAndUpdate(req.params.id, { done: req.body.done }, { new: true });
  res.json(updated.toObject());
}

// Handles DELETE /mongo-tasks/:id.
async function deleteTask(req, res) {
  // A real delete, by id.
  const deleted = await MongoTask.findByIdAndDelete(req.params.id);
  res.json(deleted.toObject());
}

// Handles DELETE /mongo-tasks — clears every real document, used by
// demo.js to reset the collection between runs, through the API itself.
async function deleteAllTasks(req, res) {
  const result = await MongoTask.deleteMany({});
  res.json({ deletedCount: result.deletedCount });
}

module.exports = { createTask, listTasks, updateTask, deleteTask, deleteAllTasks };

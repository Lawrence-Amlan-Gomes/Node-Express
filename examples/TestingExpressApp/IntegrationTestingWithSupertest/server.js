// A real, small Express app — a tasks API with an in-memory list.
// This is exactly the same shape as every other example server in
// this project. The only thing new here is that we export `app`
// WITHOUT calling .listen() on it during a test — Supertest doesn't
// need a real open network port at all. It hands requests straight
// to Express's own internal request-handling code in memory, which
// is both faster and simpler than starting a real server and using
// fetch() against a real URL.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();
app.use(express.json());

const tasks = [
  { id: 1, title: "Write tests", done: false },
  { id: 2, title: "Ship the feature", done: false },
];

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "task not found" });
  }
  res.status(200).json(task);
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4060;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Mongoose directly at all. A real backend dev
// exercises an API this way: real requests, real JSON responses, exactly
// like a frontend or Postman would. The real Mongoose calls all live in
// controllers/tasks.controller.js instead.
require("dotenv").config({ quiet: true });
const app = require("./server.js");

async function main() {
  // Port 0 means "give me any free port" — resolve only once it's really listening.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  // The real port the OS actually assigned, read back off the live server.
  const { port } = server.address();
  const base = `http://localhost:${port}`;

  // Clean up anything left over from a previous run — through the real API.
  await fetch(`${base}/tasks`, { method: "DELETE" });

  // CREATE — a real POST request.
  const createRes = await fetch(`${base}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Write the Mongo + Mongoose demo" }),
  });
  // Parse the real JSON body the API sent back.
  const created = await createRes.json();
  console.log("CREATE — POST /tasks:");
  // Print the real document MongoDB actually stored.
  console.log(created);

  // READ — a real GET request.
  const allRes = await fetch(`${base}/tasks`);
  // Parse the real JSON body the API sent back.
  const allTasks = await allRes.json();
  console.log("\nREAD — GET /tasks:");
  // Print the real, current contents of the collection.
  console.log(allTasks);

  // UPDATE — a real PATCH request, by the id the CREATE step returned.
  const updateRes = await fetch(`${base}/tasks/${created._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: true }),
  });
  // Parse the real JSON body the API sent back.
  const updated = await updateRes.json();
  console.log("\nUPDATE — PATCH /tasks/:id:");
  // Print the real document after the real update.
  console.log(updated);

  // DELETE — a real DELETE request, by the same real id.
  const deleteRes = await fetch(`${base}/tasks/${created._id}`, { method: "DELETE" });
  // Parse the real JSON body the API sent back.
  const deleted = await deleteRes.json();
  console.log("\nDELETE — DELETE /tasks/:id:");
  // Print the real document MongoDB just deleted, one last time.
  console.log(deleted);

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main()
  .catch((err) => {
    // Print the real error message if anything above actually failed.
    console.error("FAILED:", err.message);
    // Mark the process as failed, so a CI run or Postman check can notice.
    process.exitCode = 1;
  })
  .finally(() => {
    // server.js opens the real Mongo connection once, meant to live for
    // the whole real server's lifetime — this one-shot script has no
    // business closing it itself (that's not "calling the API"), so it
    // exits explicitly instead of hanging on a connection it doesn't own.
    process.exit(process.exitCode ?? 0);
  });

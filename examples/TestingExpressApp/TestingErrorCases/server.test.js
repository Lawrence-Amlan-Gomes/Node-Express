// Testing the SAD paths matters just as much as testing the happy path.
// A real backend job often means: "does this API correctly REJECT bad
// input?" and "does a real, unexpected failure still come back as a
// safe, predictable error response, instead of crashing or leaking
// internal details?"
import request from "supertest";
import { app } from "./server.js";

describe("POST /tasks (validation middleware)", () => {
  test("201 and the real created task, when the title is valid", async () => {
    // A real, fake HTTP POST with a genuinely valid body.
    const res = await request(app).post("/tasks").send({ title: "Ship the feature" });
    // Check the real 201 — a genuinely new task was created.
    expect(res.status).toBe(201);
    // Check the real, meaningful fields on the created task.
    expect(res.body).toMatchObject({ title: "Ship the feature", done: false });
  });

  test("400 with a real error message, when title is missing entirely", async () => {
    // A real, fake HTTP POST with NO title field at all.
    const res = await request(app).post("/tasks").send({});
    // Check the real 400 — the validation middleware really blocked it.
    expect(res.status).toBe(400);
    // Check the real, matching error message text.
    expect(res.body.error).toMatch(/title is required/);
  });

  test("400 with a real error message, when title is an empty string", async () => {
    // A real, fake HTTP POST with a title that's only whitespace.
    const res = await request(app).post("/tasks").send({ title: "   " });
    // Check the real 400 — whitespace-only doesn't count as a real title.
    expect(res.status).toBe(400);
    // Check the real, matching error message text.
    expect(res.body.error).toMatch(/title is required/);
  });
});

describe("PATCH /tasks/:id/complete (a thrown error, auto-forwarded by Express 5)", () => {
  test("200 and done: true, for a real existing task", async () => {
    // A real, fake HTTP PATCH against a task id that genuinely exists.
    const res = await request(app).patch("/tasks/1/complete");
    // Check the real 200.
    expect(res.status).toBe(200);
    // Check the real, updated task — done really flipped to true.
    expect(res.body).toEqual({ id: 1, title: "Write tests", done: true });
  });

  test("404 with a real, safe error body, for a task id that does not exist", async () => {
    // /tasks/999/complete makes the handler THROW, with no try/catch
    // anywhere in the route itself. This test is really proving that
    // Express 5 still catches it and routes it to the real error
    // middleware, which then sends back a normal, safe 404 JSON body
    // instead of crashing the whole server.
    const res = await request(app).patch("/tasks/999/complete");
    // Check the real 404 — the thrown error was really caught, not left to crash.
    expect(res.status).toBe(404);
    // Check the real, safe error body — no stack trace, no internal leak.
    expect(res.body).toEqual({ error: "no task with id 999" });
  });
});

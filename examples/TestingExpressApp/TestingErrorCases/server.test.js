// Testing the SAD paths matters just as much as testing the happy
// path. A real backend job often means: "does this API correctly
// REJECT bad input?" and "does a real, unexpected failure still come
// back as a safe, predictable error response, instead of crashing or
// leaking internal details?"
import request from "supertest";
import { app } from "./server.js";

describe("POST /tasks (validation middleware)", () => {
  test("201 and the real created task, when the title is valid", async () => {
    const res = await request(app).post("/tasks").send({ title: "Ship the feature" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: "Ship the feature", done: false });
  });

  test("400 with a real error message, when title is missing entirely", async () => {
    const res = await request(app).post("/tasks").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title is required/);
  });

  test("400 with a real error message, when title is an empty string", async () => {
    const res = await request(app).post("/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title is required/);
  });
});

describe("PATCH /tasks/:id/complete (a thrown error, auto-forwarded by Express 5)", () => {
  test("200 and done: true, for a real existing task", async () => {
    const res = await request(app).patch("/tasks/1/complete");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, title: "Write tests", done: true });
  });

  test("404 with a real, safe error body, for a task id that does not exist", async () => {
    // /tasks/999/complete makes the handler THROW, with no try/catch
    // anywhere in the route itself. This test is really proving that
    // Express 5 still catches it and routes it to the real error
    // middleware, which then sends back a normal, safe 404 JSON body
    // instead of crashing the whole server.
    const res = await request(app).patch("/tasks/999/complete");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "no task with id 999" });
  });
});

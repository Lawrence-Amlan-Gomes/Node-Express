// request(app) hands Supertest the real Express app object directly.
// Supertest then fakes a real HTTP request straight into it — same
// route matching, same middleware, same status codes and JSON body
// your real users would actually get — just without opening a real
// network port to do it. This is what makes it an "integration" test
// rather than a "unit" test: it exercises the real route handler AND
// Express's real routing/middleware together, not just one isolated
// function.
import request from "supertest";
import { app } from "./server.js";

describe("GET /tasks", () => {
  test("returns the full real list with a 200", async () => {
    // A real, fake HTTP GET, handed straight into the real Express app.
    const res = await request(app).get("/tasks");
    // Check the real status code Express actually sent back.
    expect(res.status).toBe(200);
    // Check the real array length — proves the real seeded data came back.
    expect(res.body).toHaveLength(2);
    // Check the real first task's exact shape.
    expect(res.body[0]).toEqual({ id: 1, title: "Write tests", done: false });
  });
});

describe("GET /tasks/:id", () => {
  test("returns a real 200 and the matching task for an id that exists", async () => {
    // A real, fake HTTP GET for a task id that genuinely exists.
    const res = await request(app).get("/tasks/2");
    // Check the real status code.
    expect(res.status).toBe(200);
    // Check the real, exact task body that came back.
    expect(res.body).toEqual({ id: 2, title: "Ship the feature", done: false });
  });

  test("returns a real 404 with an error body for an id that does not exist", async () => {
    // A real, fake HTTP GET for a task id that was never seeded.
    const res = await request(app).get("/tasks/999");
    // Check the real 404 — not a crash, not a hang, a real predictable error.
    expect(res.status).toBe(404);
    // Check the real, exact error body.
    expect(res.body).toEqual({ error: "task not found" });
  });
});

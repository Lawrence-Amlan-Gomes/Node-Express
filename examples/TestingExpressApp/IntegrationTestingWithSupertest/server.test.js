// request(app) hands Supertest the real Express app object directly.
// Supertest then fakes a real HTTP request straight into it — same
// route matching, same middleware, same status codes and JSON body
// your real users would actually get — just without opening a real
// network port to do it. This is what makes it an "integration"
// test rather than a "unit" test: it exercises the real route
// handler AND Express's real routing/middleware together, not just
// one isolated function.
import request from "supertest";
import { app } from "./server.js";

describe("GET /tasks", () => {
  test("returns the full real list with a 200", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toEqual({ id: 1, title: "Write tests", done: false });
  });
});

describe("GET /tasks/:id", () => {
  test("returns a real 200 and the matching task for an id that exists", async () => {
    const res = await request(app).get("/tasks/2");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 2, title: "Ship the feature", done: false });
  });

  test("returns a real 404 with an error body for an id that does not exist", async () => {
    const res = await request(app).get("/tasks/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "task not found" });
  });
});

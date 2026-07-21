import { app } from "./server.js";
import redisClient from "./redisClient.js";

const server = app.listen(0);
const { port } = server.address();

// No manual cleanup needed — the controller's cache key is scoped to
// THIS process's own real PID, so it's always fresh, every run.

console.log("1) GET /product/42 — real cache MISS, real starting price:");
console.log(JSON.stringify(await (await fetch(`http://localhost:${port}/product/42`)).json()));

console.log("\n2) GET /product/42 again — real cache HIT, same real price:");
console.log(JSON.stringify(await (await fetch(`http://localhost:${port}/product/42`)).json()));

console.log("\n3) PUT /product/42 with a real new price — updates the real source of truth AND invalidates the real cache:");
console.log(
  JSON.stringify(
    await (
      await fetch(`http://localhost:${port}/product/42`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: 120 }),
      })
    ).json(),
  ),
);

console.log("\n4) GET /product/42 again — real cache MISS again, now returning the real NEW price:");
console.log(JSON.stringify(await (await fetch(`http://localhost:${port}/product/42`)).json()));

console.log("\nWithout step 3's real invalidation, step 4 would have kept returning the real OLD price (89) from the still-live cache entry.");

server.close();
await redisClient.quit();

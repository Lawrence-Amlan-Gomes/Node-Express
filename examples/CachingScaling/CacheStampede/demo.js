import { app } from "./server.js";
import redisClient from "./redisClient.js";

const server = app.listen(0);
const { port } = server.address();

console.log("Firing 10 real CONCURRENT requests at the unprotected route, cold cache...");
await Promise.all(Array.from({ length: 10 }, () => fetch(`http://localhost:${port}/report-unprotected`)));

console.log("Firing 10 real CONCURRENT requests at the protected (single-flight) route, cold cache...");
await Promise.all(Array.from({ length: 10 }, () => fetch(`http://localhost:${port}/report-protected`)));

const counts = await (await fetch(`http://localhost:${port}/compute-counts`)).json();

console.log("\nReal count of how many times the expensive computation ACTUALLY ran, for 10 concurrent requests each:");
console.log(JSON.stringify(counts, null, 2));

console.log(
  `\nUnprotected: ${counts.unprotectedComputeCount} real, redundant computations for 10 identical concurrent requests — a real stampede. Protected: only ${counts.protectedComputeCount}, because every request after the first real one just awaited its real in-flight result.`,
);

server.close();
await redisClient.quit();

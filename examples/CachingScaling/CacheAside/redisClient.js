// The ONLY file that talks to Redis directly — same "one file owns the
// real client" pattern this project already uses for Prisma/Mongoose/S3.
import { createClient } from "redis";

const redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.on("error", (err) => console.error("Redis client error:", err));

await redisClient.connect();

export default redisClient;

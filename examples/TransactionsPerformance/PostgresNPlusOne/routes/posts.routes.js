// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Prisma code lives here at all.
const { Router } = require("express");
const { resetPosts, listPostsNaive, listPostsOptimized, deleteAllPosts } = require("../controllers/posts.controller");

// A mini version of "app" — mounted at "/posts" by server.js.
const router = Router();

// POST /posts/reset — seeds fresh real authors and posts.
router.post("/reset", resetPosts);
// GET /posts/naive — the N+1 bug: 1 + 1-per-post real queries.
router.get("/naive", listPostsNaive);
// GET /posts/optimized — Prisma's own fix: a fixed 2 real queries.
router.get("/optimized", listPostsOptimized);
// DELETE /posts — clears both real tables (used by demo.js to leave them empty when done).
router.delete("/", deleteAllPosts);

module.exports = router;

// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Prisma code lives here at all.
const { Router } = require("express");
const { createPost, listPosts, deleteAllPosts } = require("../controllers/posts.controller");

// A mini version of "app" — mounted at "/posts" by server.js.
const router = Router();

// POST /posts — create a real post (no "published" sent, on purpose).
router.post("/", createPost);
// GET /posts — list every real post.
router.get("/", listPosts);
// DELETE /posts — clear every real post (used by demo.js to reset between runs).
router.delete("/", deleteAllPosts);

module.exports = router;

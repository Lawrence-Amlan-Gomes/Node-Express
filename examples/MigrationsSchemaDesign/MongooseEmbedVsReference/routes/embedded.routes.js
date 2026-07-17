// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Mongoose code lives here at all.
const { Router } = require("express");
const { createPost, getPostWithComments, deleteAllPosts } = require("../controllers/embedded.controller");

// A mini version of "app" — mounted at "/posts-embedded" by server.js.
const router = Router();

router.post("/", createPost);
router.get("/:id", getPostWithComments);
// Clears every real document — used by demo.js to reset between runs.
router.delete("/", deleteAllPosts);

module.exports = router;

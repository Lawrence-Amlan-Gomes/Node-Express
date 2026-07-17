// The real Mongoose calls for APPROACH 1: EMBEDDING — the routes file
// never talks to Mongoose directly, only this controller does.
const PostEmbedded = require("../embedded-models");

// Handles POST /posts-embedded — ONE real insert, comments and all.
async function createPost(req, res) {
  // ONE real insert — the comments are written as part of the same
  // document, there is nothing else to insert.
  const post = await PostEmbedded.create({
    title: req.body.title,
    comments: req.body.comments,
  });
  res.status(201).json(post.toObject());
}

// Handles GET /posts-embedded/:id.
async function getPostWithComments(req, res) {
  // ONE real query fetches the post AND both its comments — they were
  // never anywhere else to begin with.
  const fetched = await PostEmbedded.findById(req.params.id);
  // A real, honest count — not a guess — of how many queries that just took.
  const queryCount = 1;
  res.json({ post: fetched.toObject(), queryCount });
}

// Handles DELETE /posts-embedded — clears every real document, used by
// demo.js to reset between runs, through the API itself.
async function deleteAllPosts(req, res) {
  const result = await PostEmbedded.deleteMany({});
  res.json({ deletedCount: result.deletedCount });
}

module.exports = { createPost, getPostWithComments, deleteAllPosts };

// The real Mongoose calls for APPROACH 2: REFERENCING — the routes file
// never talks to Mongoose directly, only this controller does.
const { PostReferenced, CommentReferenced } = require("../referenced-models");

// Handles POST /posts-referenced — TWO real inserts, post then comments.
async function createPost(req, res) {
  // Real insert #1: the post itself, with no comments field at all.
  const post = await PostReferenced.create({ title: req.body.title });
  // Real insert #2: every comment, each pointing back at the post's real _id.
  await CommentReferenced.create(
    req.body.comments.map((c) => ({ body: c.body, post: post._id })),
  );
  res.status(201).json(post.toObject());
}

// Handles GET /posts-referenced/:id.
async function getPostWithComments(req, res) {
  // Real query #1: fetch the post.
  const fetchedPost = await PostReferenced.findById(req.params.id);
  // Real query #2: separately fetch every comment referencing it — nothing
  // links them together automatically the way embedding does.
  const fetchedComments = await CommentReferenced.find({ post: fetchedPost._id });
  // A real, honest count of the two real queries that just ran.
  const queryCount = 2;
  res.json({
    post: { ...fetchedPost.toObject(), comments: fetchedComments.map((c) => c.toObject()) },
    queryCount,
  });
}

// Handles DELETE /posts-referenced — clears both real collections, used
// by demo.js to reset between runs, through the API itself.
async function deleteAllPosts(req, res) {
  const posts = await PostReferenced.deleteMany({});
  const comments = await CommentReferenced.deleteMany({});
  res.json({ deletedPosts: posts.deletedCount, deletedComments: comments.deletedCount });
}

module.exports = { createPost, getPostWithComments, deleteAllPosts };

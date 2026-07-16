// APPROACH 1: EMBEDDING. The comments live INSIDE the post document
// itself, as a real array field — there is no separate "comments"
// collection at all in this approach. Fetching a post already comes
// with all of its comments, because they were never anywhere else.
const mongoose = require("mongoose");

const commentSubSchema = new mongoose.Schema(
  { body: String },
  { _id: true }, // still gets its own real _id, just nested inside the post
);

const postEmbeddedSchema = new mongoose.Schema({
  title: String,
  comments: [commentSubSchema],
});

module.exports = mongoose.model("PostEmbedded", postEmbeddedSchema, "learning_posts_embedded");

// APPROACH 1: EMBEDDING. The comments live INSIDE the post document
// itself, as a real array field — there is no separate "comments"
// collection at all in this approach. Fetching a post already comes
// with all of its comments, because they were never anywhere else.
const mongoose = require("mongoose");

// A real, nested schema for one comment — still gets its own real _id,
// just embedded inside the post instead of living in its own collection.
const commentSubSchema = new mongoose.Schema(
  { body: String },
  { _id: true },
);

// The real post schema — comments is a real array of the sub-schema above.
const postEmbeddedSchema = new mongoose.Schema({
  title: String,
  comments: [commentSubSchema],
});

// Pins this approach's own real, separate collection name.
module.exports = mongoose.model("PostEmbedded", postEmbeddedSchema, "learning_posts_embedded");

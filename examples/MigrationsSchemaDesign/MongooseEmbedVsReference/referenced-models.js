// APPROACH 2: REFERENCING. The post and its comments are TWO separate
// real documents, in TWO separate real collections — a comment just
// stores the post's real _id in its own "post" field. This is the
// document-database equivalent of a foreign key, except MongoDB itself
// doesn't enforce or check it the way a real Postgres foreign key does.
const mongoose = require("mongoose");

// The real post schema — no comments field at all, on purpose.
const postReferencedSchema = new mongoose.Schema({
  title: String,
});

// The real comment schema — "post" holds the real _id of the post it belongs to.
const commentReferencedSchema = new mongoose.Schema({
  body: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "PostReferenced" },
});

// Exports both real models, each pinned to its own real, separate collection.
module.exports = {
  PostReferenced: mongoose.model("PostReferenced", postReferencedSchema, "learning_posts_referenced"),
  CommentReferenced: mongoose.model("CommentReferenced", commentReferencedSchema, "learning_comments_referenced"),
};

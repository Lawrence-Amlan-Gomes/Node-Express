// APPROACH 2: REFERENCING. The post and its comments are TWO separate
// real documents, in TWO separate real collections — a comment just
// stores the post's real _id in its own "post" field. This is the
// document-database equivalent of a foreign key, except MongoDB itself
// doesn't enforce or check it the way a real Postgres foreign key does.
const mongoose = require("mongoose");

const postReferencedSchema = new mongoose.Schema({
  title: String,
});

const commentReferencedSchema = new mongoose.Schema({
  body: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "PostReferenced" },
});

module.exports = {
  PostReferenced: mongoose.model("PostReferenced", postReferencedSchema, "learning_posts_referenced"),
  CommentReferenced: mongoose.model("CommentReferenced", commentReferencedSchema, "learning_comments_referenced"),
};

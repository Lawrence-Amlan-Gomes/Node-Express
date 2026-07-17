// A DOCUMENT model (what a database like MongoDB actually stores) keeps
// related data TOGETHER in one place — a post's author name and its
// comments live directly inside the post itself, embedded, instead of
// being spread across separate tables. This really is just a plain JS
// object/array — that IS what a document is (JSON-shaped data), which is
// why no real database engine is needed to demonstrate this half of the
// comparison honestly; the shape itself is the whole point.
export function buildDocumentBlog() {
  // One real object — the author's name and every comment already inside it.
  return {
    id: 1,
    title: "Learning SQL vs NoSQL",
    authorName: "Lawrence",
    comments: [{ text: "Great post!" }, { text: "Learned a lot, thanks." }],
  };
}

// Getting "a post with its author and comments" back out needs NO query at
// all — it's already sitting together in the same object. This function
// exists only so the two models can be compared with the exact same
// return shape, side by side.
export function getPostWithComments(post) {
  // Just reads properties that were already there — no lookup, no join.
  return {
    id: post.id,
    title: post.title,
    authorName: post.authorName,
    comments: post.comments.map((c) => c.text),
  };
}

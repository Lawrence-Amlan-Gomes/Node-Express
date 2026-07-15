// The same blog data, document-shaped: every post is its own object, with
// its comments (and each comment's real author name) embedded directly.
export function buildDocumentPosts() {
  return [
    { id: 1, title: "Post One", comments: [{ authorName: "Alex", text: "Nice one!" }] },
    { id: 2, title: "Post Two", comments: [{ authorName: "Alex", text: "Agreed." }] },
    { id: 3, title: "Post Three", comments: [{ authorName: "Lawrence", text: "Interesting take." }] },
  ];
}

// PATTERN A: "get one post with its comments" — already all together in
// one object. Zero queries needed.
export function getPostWithComments(posts, postId) {
  const post = posts.find((p) => p.id === postId);
  return { id: post.id, title: post.title, comments: post.comments.map((c) => c.text) };
}

// PATTERN B: "find every comment a specific person ever wrote, across
// EVERY post" — there's no query engine to ask, so the application itself
// has to loop through EVERY post's embedded comments array by hand,
// checking each one. This is the real, structural cost of embedding: a
// question that spans many documents at once has no shortcut.
export function findCommentsByAuthor(posts, authorName) {
  let postsScanned = 0;
  let commentsScanned = 0;
  const matches = [];

  for (const post of posts) {
    postsScanned++;
    for (const comment of post.comments) {
      commentsScanned++;
      if (comment.authorName === authorName) {
        matches.push({ text: comment.text, postTitle: post.title });
      }
    }
  }

  return { matches, postsScanned, commentsScanned };
}

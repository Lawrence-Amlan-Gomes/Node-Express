// The same blog data, document-shaped: every post is its own object, with
// its comments (and each comment's real author name) embedded directly.
export function buildDocumentPosts() {
  // Three real post objects — each one's comments already inside it.
  return [
    { id: 1, title: "Post One", comments: [{ authorName: "Alex", text: "Nice one!" }] },
    { id: 2, title: "Post Two", comments: [{ authorName: "Alex", text: "Agreed." }] },
    { id: 3, title: "Post Three", comments: [{ authorName: "Lawrence", text: "Interesting take." }] },
  ];
}

// PATTERN A: "get one post with its comments" — already all together in
// one object. Zero queries needed.
export function getPostWithComments(posts, postId) {
  // A plain in-memory array search — no query engine involved at all.
  const post = posts.find((p) => p.id === postId);
  // Its comments were already embedded — just reshape, don't fetch.
  return { id: post.id, title: post.title, comments: post.comments.map((c) => c.text) };
}

// PATTERN B: "find every comment a specific person ever wrote, across
// EVERY post" — there's no query engine to ask, so the application itself
// has to loop through EVERY post's embedded comments array by hand,
// checking each one. This is the real, structural cost of embedding: a
// question that spans many documents at once has no shortcut.
export function findCommentsByAuthor(posts, authorName) {
  // Real counters, so the demo can print an honest, real cost — not a guess.
  let postsScanned = 0;
  let commentsScanned = 0;
  const matches = [];

  for (const post of posts) {
    // Count every post actually looked at, one by one, no shortcuts.
    postsScanned++;
    for (const comment of post.comments) {
      // Count every comment actually inspected, inside every post.
      commentsScanned++;
      if (comment.authorName === authorName) {
        // A real match — record it.
        matches.push({ text: comment.text, postTitle: post.title });
      }
    }
  }

  // Hand back the real matches plus the real scan counts.
  return { matches, postsScanned, commentsScanned };
}

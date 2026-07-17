// The real Prisma calls for the post-migration Post table — the routes
// file never talks to Prisma directly, only this controller does.
const { PrismaClient } = require("@prisma/client");

// A real Prisma client for this migrated schema.
const prisma = new PrismaClient();

// Handles POST /posts.
async function createPost(req, res) {
  // Deliberately NOT reading "published" from req.body here — the real
  // column default (added by the second migration) is what supplies the
  // value, not this code, proving the migration actually did its job.
  const created = await prisma.post.create({
    data: { title: req.body.title },
  });
  res.status(201).json(created);
}

// Handles GET /posts.
async function listPosts(req, res) {
  // A real SELECT of every row currently in the table.
  const posts = await prisma.post.findMany();
  res.json(posts);
}

// Handles DELETE /posts — clears every real row, used by demo.js to
// reset the table between runs, through the API itself.
async function deleteAllPosts(req, res) {
  const result = await prisma.post.deleteMany();
  res.json({ deletedCount: result.count });
}

module.exports = { createPost, listPosts, deleteAllPosts };

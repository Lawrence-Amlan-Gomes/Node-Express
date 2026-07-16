// Real proof of the actual cost difference between MongoDB's two real
// schema design options, fetching the SAME logical thing both ways: one
// post, plus all of its comments.
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const PostEmbedded = require("./embedded-models");
const { PostReferenced, CommentReferenced } = require("./referenced-models");

async function runEmbedded() {
  await PostEmbedded.deleteMany({});

  // ONE real insert — the comments are written as part of the same
  // document, there is nothing else to insert.
  const post = await PostEmbedded.create({
    title: "Why Node is single-threaded",
    comments: [{ body: "Great explanation!" }, { body: "Finally makes sense." }],
  });

  // ONE real query fetches the post AND both its comments — they were
  // never anywhere else to begin with.
  const fetched = await PostEmbedded.findById(post._id);
  const queryCount = 1;

  return { fetched: fetched.toObject(), queryCount };
}

async function runReferenced() {
  await PostReferenced.deleteMany({});
  await CommentReferenced.deleteMany({});

  // TWO real inserts: the post, then the comments (each pointing back
  // at the post's real _id via the "post" field).
  const post = await PostReferenced.create({ title: "Why Node is single-threaded" });
  await CommentReferenced.create([
    { body: "Great explanation!", post: post._id },
    { body: "Finally makes sense.", post: post._id },
  ]);

  // TWO real queries: one to fetch the post, a SECOND to separately
  // fetch every comment referencing it — nothing links them together
  // automatically the way embedding does.
  const fetchedPost = await PostReferenced.findById(post._id);
  const fetchedComments = await CommentReferenced.find({ post: post._id });
  const queryCount = 2;

  return {
    fetched: { ...fetchedPost.toObject(), comments: fetchedComments.map((c) => c.toObject()) },
    queryCount,
  };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);

  const embedded = await runEmbedded();
  console.log("=== EMBEDDED (one document, comments array inside it) ===");
  console.log(embedded.fetched);
  console.log(`Real queries needed to fetch the post + its comments: ${embedded.queryCount}`);

  const referenced = await runReferenced();
  console.log("\n=== REFERENCED (post document + separate comments collection) ===");
  console.log(referenced.fetched);
  console.log(`Real queries needed to fetch the post + its comments: ${referenced.queryCount}`);

  console.log("\n=== The real trade-off ===");
  console.log("Embedding wins here: 1 query instead of 2, because the comments never left the post document. But an embedded array keeps growing with the post forever — MongoDB caps a single document at 16MB, a real hard limit — so embedding stops being safe for something like \"every comment ever,\" on a popular post, over years. Referencing avoids that growth problem entirely (comments live in their own collection, no size ceiling tied to the post), at the real cost of needing a second query every time you want them together.");

  // Clean up after this run — a real shared database, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await PostEmbedded.deleteMany({});
  await PostReferenced.deleteMany({});
  await CommentReferenced.deleteMany({});
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

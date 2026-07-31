// This is the movies.controller.js file for the "FilteringSortingBasics"
// mini-project. What this file does: it is the ONLY file that talks to the
// real database. It builds a real filter/sort/paginate find() call from
// real query-string parameters, safely — never by trusting raw user input
// as the actual shape of the query.
const { getCollection } = require("../db"); // Get the shared collection helper from db.js

const SORTS = { // A fixed, trusted list of the only sort options this API allows — never built from raw user input
  rating_desc: { rating: -1 }, // Highest rating first
  year_asc: { releaseYear: 1 }, // Oldest release first
};

async function createMovie(req, res) { // Runs when someone sends POST /movies
  const { title, genre, rating, releaseYear } = req.body; // Pull the real values the client sent, out of the request body
  const doc = { title, genre, rating, releaseYear }; // Build the real document to insert
  const result = await getCollection().insertOne(doc); // Send an INSERT to MongoDB and wait for the real answer
  res.status(201).json({ _id: result.insertedId, ...doc }); // Send back status 201 ("created") plus the real new document
}

async function listMovies(req, res) { // Runs when someone sends GET /movies
  // NEVER do this: getCollection().find(req.query) — a query string like
  // ?genre[$ne]=null is parsed by Express into a REAL { genre: { $ne: null } }
  // object, which Mongo would happily run as a REAL operator, not a plain
  // value — a genuine NoSQL injection, the exact same class of bug SQL's
  // parameterized queries prevent, just shaped differently.
  const filter = {}; // Start a real, empty, safe filter object — built field by field below, never trusted wholesale
  if (typeof req.query.genre === "string") filter.genre = req.query.genre; // Only accept genre as a real plain string, exactly as typed
  if (typeof req.query.minRating === "string") { // Only accept minRating as a real plain string before converting it
    const minRating = Number(req.query.minRating); // Convert the real string into a real number
    if (!Number.isNaN(minRating)) filter.rating = { $gte: minRating }; // Only add the real condition if it's a genuinely valid number
  }

  const sortKey = typeof req.query.sort === "string" ? req.query.sort : undefined; // Read the requested sort name, if it's a real plain string
  const sort = SORTS[sortKey] ?? {}; // Look it up in the fixed, trusted list above — an unknown name safely falls back to no sort at all

  const limit = Number(req.query.limit) || 50; // Convert to a real number, or default to a real, sane cap of 50
  const skip = Number(req.query.offset) || 0; // Convert to a real number, or default to 0 (skip nothing)

  const movies = await getCollection().find(filter).sort(sort).limit(limit).skip(skip).toArray(); // Run the real, safely-built query and collect the real results
  res.json(movies); // Send back the real matching documents as JSON
}

async function deleteAllMovies(req, res) { // Runs when someone sends DELETE /movies
  const result = await getCollection().deleteMany({}); // Remove every real document from the collection
  res.json({ deletedCount: result.deletedCount }); // Send back how many real documents were actually removed
}

module.exports = { createMovie, listMovies, deleteAllMovies }; // Share these 3 functions so routes/movies.routes.js can use them

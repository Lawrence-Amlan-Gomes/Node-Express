// This is the books.controller.js file for the "RawMongoCrud" mini-project.
// What this file does: it is the ONLY file that talks to the real database.
// It runs a full CREATE -> READ ONE -> READ ALL -> UPDATE -> DELETE cycle
// against a real "books" collection, by hand, with the native driver.
const { getCollection } = require("../db"); // Get the shared collection helper from db.js
const { ObjectId } = require("mongodb"); // Load ObjectId, the real class every Mongo _id value is made from

function toObjectId(id) { // A small helper: safely turn a real URL string into a real ObjectId, or return null
  try {
    return new ObjectId(id); // A URL param is always a plain string — Mongo needs a real ObjectId instance to match against _id
  } catch {
    return null; // A string that isn't a real, valid 24-character hex id throws here — caught and reported as null instead of crashing
  }
}

async function createBook(req, res) { // Runs when someone sends POST /books
  const { title, author, publishedYear } = req.body; // Pull the real values the client sent, out of the request body
  const doc = { title, author, publishedYear }; // Build the real document to insert
  const result = await getCollection().insertOne(doc); // Send an INSERT to MongoDB and wait for the real answer
  res.status(201).json({ _id: result.insertedId, ...doc }); // Send back status 201 ("created") plus the real new document, including its real generated _id
}

async function getBookById(req, res) { // Runs when someone sends GET /books/:id
  const objectId = toObjectId(req.params.id); // Convert the real URL string into a real ObjectId, or null if it's not a valid one
  if (!objectId) return res.status(404).json({ error: "No book with that id." }); // An invalid id format can never match a real book, so treat it the same as "not found"
  const book = await getCollection().findOne({ _id: objectId }); // Ask for the one real document whose real _id matches
  if (!book) return res.status(404).json({ error: "No book with that id." }); // A validly-formatted id that just isn't in the collection is also "not found"
  res.json(book); // Send back the real document as JSON
}

async function listBooks(req, res) { // Runs when someone sends GET /books
  const books = await getCollection().find({}).toArray(); // Ask for every real document, and collect them into a real array
  res.json(books); // Send back the real documents as JSON
}

async function updateBook(req, res) { // Runs when someone sends PATCH /books/:id
  const objectId = toObjectId(req.params.id); // Convert the real URL string into a real ObjectId, or null if it's not a valid one
  if (!objectId) return res.status(404).json({ error: "No book with that id." }); // Same real "can't possibly match" short-circuit as getBookById
  const { title, author, publishedYear } = req.body; // Pull the real new values the client sent
  const result = await getCollection().findOneAndUpdate( // Update the one real matching document AND get it back, in a single real round trip
    { _id: objectId }, // Which real document to update
    { $set: { title, author, publishedYear } }, // $set replaces only these real fields, leaving everything else on the document untouched
    { returnDocument: "after" } // Ask Mongo to hand back the real document AFTER the update, not the stale one from before
  );
  if (!result) return res.status(404).json({ error: "No book with that id." }); // No real document matched that real id
  res.json(result); // Send back the real, already-updated document
}

async function deleteBook(req, res) { // Runs when someone sends DELETE /books/:id
  const objectId = toObjectId(req.params.id); // Convert the real URL string into a real ObjectId, or null if it's not a valid one
  if (!objectId) return res.status(404).json({ error: "No book with that id." }); // Same real short-circuit as the other id-based routes
  const result = await getCollection().findOneAndDelete({ _id: objectId }); // Delete the one real matching document AND get back the real document that was removed
  if (!result) return res.status(404).json({ error: "No book with that id." }); // No real document matched that real id
  res.json(result); // Send back the real document that was just deleted
}

async function deleteAllBooks(req, res) { // Runs when someone sends DELETE /books
  const result = await getCollection().deleteMany({}); // Remove every real document from the collection
  res.json({ deletedCount: result.deletedCount }); // Send back how many real documents were actually removed
}

module.exports = { createBook, getBookById, listBooks, updateBook, deleteBook, deleteAllBooks }; // Share these 6 functions so routes/books.routes.js can use them

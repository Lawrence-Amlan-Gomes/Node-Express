// This is the products.controller.js file for the "MongoConnectionAndDocuments" mini-project.
// What this file does: it is the ONLY file that talks to the real database.
// It has 4 functions: create a product, list all products, show the real
// JS type of each real field, and delete every product. There is no
// "create collection" step anywhere — MongoDB makes the real collection by
// itself the moment the first real document is inserted into it.
const { getCollection } = require("../db"); // Get the shared collection helper from db.js
const { ObjectId } = require("mongodb"); // Load ObjectId, the real class Mongo's own _id values are made from

function describeType(value) { // A small helper: given one real value, name its real JS/BSON type
  if (value instanceof ObjectId) return "ObjectId"; // Mongo's own real id type, not a plain string
  if (value instanceof Date) return "Date"; // A real JS Date object, not a plain string
  if (Array.isArray(value)) return "Array"; // A real JS array — Postgres would need a whole separate table for this
  return typeof value; // For everything else (string, number, boolean), JS's own typeof already gives the real answer
}

async function createProduct(req, res) { // Runs when someone sends POST /products
  const { name, price, inStock, tags } = req.body; // Pull the real values the client sent, out of the request body
  const doc = { // Build the real document to insert — this exact shape is NOT enforced by Mongo itself
    name, // Plain text, same as Postgres's TEXT column
    price, // A real number — kept as a real JS number the whole way, no string conversion
    inStock: inStock ?? true, // A real boolean, defaulting to true if the client left it out
    tags: tags ?? [], // A real embedded array — something Postgres can't do inside a single column
    createdAt: new Date(), // A real JS Date, stored as a real BSON date
  };
  const result = await getCollection().insertOne(doc); // Send an INSERT to MongoDB and wait for the real answer
  res.status(201).json({ _id: result.insertedId, ...doc }); // Send back status 201 ("created") plus the real new document, including its real generated _id
}

async function listProductTypes(req, res) { // Runs when someone sends GET /products/types
  const doc = await getCollection().findOne({}); // Ask for one real, real document currently in the collection
  if (!doc) return res.status(404).json({ error: "No product yet — create one first." }); // If the collection is really empty, say so honestly instead of guessing
  const types = {}; // Start a real, empty object to hold field name -> real type name
  for (const key of Object.keys(doc)) { // Walk over every real field this ONE document actually has
    types[key] = describeType(doc[key]); // Record that field's real, runtime-checked type
  }
  res.json(types); // Send back the real type of every real field on this real document
}

async function listProducts(req, res) { // Runs when someone sends GET /products
  const products = await getCollection().find({}).toArray(); // Ask for every real document, and collect them into a real array
  res.json(products); // Send back the real documents as JSON
}

async function deleteAllProducts(req, res) { // Runs when someone sends DELETE /products
  const result = await getCollection().deleteMany({}); // Remove every real document from the collection
  res.json({ deletedCount: result.deletedCount }); // Send back how many real documents were actually removed
}

module.exports = { createProduct, listProductTypes, listProducts, deleteAllProducts }; // Share these 4 functions so routes/products.routes.js can use them

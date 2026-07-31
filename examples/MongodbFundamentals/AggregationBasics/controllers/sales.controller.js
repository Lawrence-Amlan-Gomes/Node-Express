// This is the sales.controller.js file for the "AggregationBasics" mini-
// project. What this file does: it is the ONLY file that talks to the real
// database. It runs a real $group aggregation pipeline — one real summary
// document per category, computed by MongoDB itself.
const { getCollection } = require("../db"); // Get the shared collection helper from db.js

async function createSale(req, res) { // Runs when someone sends POST /sales
  const { category, amount } = req.body; // Pull the real values the client sent, out of the request body
  const doc = { category, amount }; // Build the real document to insert
  const result = await getCollection().insertOne(doc); // Send an INSERT to MongoDB and wait for the real answer
  res.status(201).json({ _id: result.insertedId, ...doc }); // Send back status 201 ("created") plus the real new document
}

async function salesSummary(req, res) { // Runs when someone sends GET /sales/summary
  const summary = await getCollection() // Start from the real collection
    .aggregate([ // Run a real, multi-stage aggregation pipeline
      {
        $group: { // Stage 1: split every real document into buckets by category, then summarize each bucket
          _id: "$category", // The real bucket key — one real summary document per distinct category value
          count: { $sum: 1 }, // Add 1 for every real document in this bucket — the real count
          total: { $sum: "$amount" }, // Add up every real amount in this bucket
          average: { $avg: "$amount" }, // The real mean of every amount in this bucket
          min: { $min: "$amount" }, // The real smallest amount in this bucket
          max: { $max: "$amount" }, // The real largest amount in this bucket
        },
      },
      { $sort: { _id: 1 } }, // Stage 2: order the real summary rows alphabetically by category
    ])
    .toArray(); // Collect the real summary documents into a real array
  res.json(summary); // Send back the real summary — every number here is a genuine JS number, no string-casting needed
}

async function deleteAllSales(req, res) { // Runs when someone sends DELETE /sales
  const result = await getCollection().deleteMany({}); // Remove every real document from the collection
  res.json({ deletedCount: result.deletedCount }); // Send back how many real documents were actually removed
}

module.exports = { createSale, salesSummary, deleteAllSales }; // Share these 3 functions so routes/sales.routes.js can use them

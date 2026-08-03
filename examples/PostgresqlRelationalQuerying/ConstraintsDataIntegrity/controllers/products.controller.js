// This is the products.controller.js file for the "ConstraintsDataIntegrity"
// mini-project. What this file does: the one real endpoint that proves
// BOTH a real CHECK constraint (price > 0) and a real UNIQUE constraint
// (name) — same table, two different real Postgres error codes.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createProduct(req, res) { // Runs when someone sends POST /products
  const { name, price } = req.body; // Pull the real values the client sent
  try { // Try the real INSERT — Postgres itself checks CHECK and UNIQUE, not this code
    const result = await pool.query(
      `INSERT INTO ${SCHEMA}.products (name, price) VALUES ($1, $2) RETURNING *`,
      [name, price]
    );
    res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row
  } catch (err) { // Postgres rejected the INSERT — a real CHECK or UNIQUE violation
    if (err.code === "23514") { // "23514" is Postgres's own real error code for "check_violation"
      return res.status(400).json({ error: `price must be greater than 0 — Postgres's own CHECK constraint rejected ${price}.` });
    }
    if (err.code === "23505") { // "23505" is Postgres's own real error code for "unique_violation"
      return res.status(409).json({ error: `A product named "${name}" already exists — Postgres's own UNIQUE constraint rejected the duplicate.` });
    }
    throw err; // Any other kind of real error: let Express 5's own automatic forwarding handle it
  }
}

async function listProducts(req, res) { // Runs when someone sends GET /products
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.products ORDER BY id`);
  res.json(result.rows); // Send back every real row currently in the table
}

async function deleteAllProducts(req, res) { // Runs when someone sends DELETE /products
  const result = await pool.query(`DELETE FROM ${SCHEMA}.products`);
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createProduct, listProducts, deleteAllProducts }; // Share these 3 functions so routes/products.routes.js can use them

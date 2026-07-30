// This is the products.controller.js file for the "PostgresConnectionAndTypes" mini-project.
// What this file does: it is the ONLY file that talks to the real database.
// It has 4 functions, one for each real thing the API can do: create a
// product, list all products, show the real column types, and delete
// every product. routes/products.routes.js just points a URL to these.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createProduct(req, res) { // Runs when someone sends POST /products
  const { name, price, inStock } = req.body; // Pull the real values the client sent, out of the request body
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.products (name, price, in_stock) VALUES ($1, $2, $3) RETURNING *`, // The SQL text: add a new row, and send the new row back
    [name, price, inStock ?? true] // The real values for $1, $2, $3 — kept separate from the SQL text on purpose, so they can never be read as SQL
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function listProducts(req, res) { // Runs when someone sends GET /products
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.products ORDER BY id`); // Ask for every real row, oldest first
  res.json(result.rows); // Send back the real rows as JSON
}

async function listColumns(req, res) { // Runs when someone sends GET /products/columns
  const result = await pool.query( // Ask Postgres's own notebook of table info (not our own table) for real answers
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position`, // The SQL text: list every column's real name and real type
    [SCHEMA, "products"] // The real values for $1 and $2 — which schema and which table to look up
  );
  res.json(result.rows); // Send back the real column info as JSON
}

async function deleteAllProducts(req, res) { // Runs when someone sends DELETE /products
  const result = await pool.query(`DELETE FROM ${SCHEMA}.products`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createProduct, listProducts, listColumns, deleteAllProducts }; // Share these 4 functions so routes/products.routes.js can use them

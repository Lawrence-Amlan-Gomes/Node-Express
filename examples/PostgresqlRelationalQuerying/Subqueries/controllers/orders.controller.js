// This is the orders.controller.js file for the "Subqueries" mini-project.
// What this file does: create/list/delete-all for real orders, plus the
// real SCALAR-subquery endpoint, above-average.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createOrder(req, res) { // Runs when someone sends POST /orders
  const { customerId, amount } = req.body; // Pull the real values the client sent, out of the request body
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.orders (customer_id, amount) VALUES ($1, $2) RETURNING *`, // Add a new row, and send the new row back
    [customerId, amount] // The real values for $1, $2
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function listOrders(req, res) { // Runs when someone sends GET /orders
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.orders ORDER BY id`); // Ask for every real row, oldest first
  res.json(result.rows); // Send back the real rows as JSON
}

async function aboveAverage(req, res) { // Runs when someone sends GET /orders/above-average
  const result = await pool.query(` -- a SCALAR subquery: the inner query returns exactly ONE real number
    SELECT * FROM ${SCHEMA}.orders
    WHERE amount > (SELECT AVG(amount) FROM ${SCHEMA}.orders) -- Postgres runs the inner SELECT first, gets one real average, then filters using it
    ORDER BY amount DESC
  `); // Still just ONE real round trip — Postgres itself runs the inner query, not this Node code
  res.json(result.rows); // Send back the real matching orders as JSON
}

async function deleteAllOrders(req, res) { // Runs when someone sends DELETE /orders
  const result = await pool.query(`DELETE FROM ${SCHEMA}.orders`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createOrder, listOrders, aboveAverage, deleteAllOrders }; // Share these 4 functions so routes/orders.routes.js can use them

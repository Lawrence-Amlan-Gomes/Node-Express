// This is the orders.controller.js file for the "PrimaryKeysForeignKeys"
// mini-project. What this file does: create/list/delete-all for the
// "orders" table — and proves the real foreign key constraint by catching
// the exact real error Postgres sends back when customer_id doesn't exist.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createOrder(req, res) { // Runs when someone sends POST /orders
  const { customerId, product } = req.body; // Pull the real values the client sent, out of the request body
  try { // Try the real INSERT — Postgres itself checks the foreign key, not this code
    const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
      `INSERT INTO ${SCHEMA}.orders (customer_id, product) VALUES ($1, $2) RETURNING *`, // Add a new row, and send the new row back
      [customerId, product] // The real values for $1, $2
    );
    res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
  } catch (err) { // Postgres rejected the INSERT — most likely a real foreign key violation
    if (err.code === "23503") { // "23503" is Postgres's own real error code for "foreign_key_violation"
      return res.status(400).json({ // Send back a clear, real 400 — not a raw 500 leaking the database's own wording
        error: `No customer with id ${customerId} exists — an order must point at a real customer.`,
      });
    }
    throw err; // Any other kind of real error: let Express 5's own automatic forwarding send it to the central error handler
  }
}

async function listOrders(req, res) { // Runs when someone sends GET /orders
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.orders ORDER BY id`); // Ask for every real row, oldest first
  res.json(result.rows); // Send back the real rows as JSON — notice customer_id is just a number here, not a name yet
}

async function deleteAllOrders(req, res) { // Runs when someone sends DELETE /orders
  const result = await pool.query(`DELETE FROM ${SCHEMA}.orders`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createOrder, listOrders, deleteAllOrders }; // Share these 3 functions so routes/orders.routes.js can use them

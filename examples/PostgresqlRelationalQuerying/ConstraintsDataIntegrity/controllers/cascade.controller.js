// This is the cascade.controller.js file for the "ConstraintsDataIntegrity"
// mini-project. What this file does: real customer/order create for the
// CASCADE demo, plus the one real endpoint that deletes a customer and
// lets Postgres itself auto-delete every order pointing at it.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createCustomer(req, res) { // Runs when someone sends POST /cascade/customers
  const { name } = req.body; // Pull the real value the client sent
  const result = await pool.query(`INSERT INTO ${SCHEMA}.customers_cascade (name) VALUES ($1) RETURNING *`, [name]); // Add a new customer row
  res.status(201).json(result.rows[0]); // Send back the real new row
}

async function createOrder(req, res) { // Runs when someone sends POST /cascade/orders
  const { customerId, product } = req.body; // Pull the real values the client sent
  const result = await pool.query( // Add a new order row, pointing at a real customer
    `INSERT INTO ${SCHEMA}.orders_cascade (customer_id, product) VALUES ($1, $2) RETURNING *`,
    [customerId, product]
  );
  res.status(201).json(result.rows[0]); // Send back the real new row
}

async function listOrders(req, res) { // Runs when someone sends GET /cascade/orders — used to PROVE the cascade actually ran
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.orders_cascade ORDER BY id`);
  res.json(result.rows); // Send back every real order still in the table
}

async function deleteCustomer(req, res) { // Runs when someone sends DELETE /cascade/customers/:id — the real cascading delete
  const result = await pool.query(`DELETE FROM ${SCHEMA}.customers_cascade WHERE id = $1 RETURNING *`, [req.params.id]); // Postgres deletes this row AND, automatically, every order_cascade row pointing at it
  if (result.rows.length === 0) { // Check whether Postgres actually found and removed a row
    return res.status(404).json({ error: "No customer with that id." });
  }
  res.json(result.rows[0]); // The delete succeeded — check GET /cascade/orders next to see the real cascade
}

async function reset(req, res) { // Runs when someone sends DELETE /cascade/reset — clears both tables for a fresh run
  await pool.query(`DELETE FROM ${SCHEMA}.orders_cascade`); // Clear leftover orders first (harmless either order here, but stays consistent with the RESTRICT reset)
  await pool.query(`DELETE FROM ${SCHEMA}.customers_cascade`); // Clear leftover customers
  res.json({ reset: true });
}

module.exports = { createCustomer, createOrder, listOrders, deleteCustomer, reset }; // Share these 5 functions so routes/cascade.routes.js can use them

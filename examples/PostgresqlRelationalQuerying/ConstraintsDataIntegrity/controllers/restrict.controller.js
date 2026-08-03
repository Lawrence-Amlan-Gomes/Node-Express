// This is the restrict.controller.js file for the "ConstraintsDataIntegrity"
// mini-project. What this file does: real customer/order create for the
// RESTRICT demo, plus the one real endpoint that actually tries the
// blocked delete and catches Postgres's real refusal.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createCustomer(req, res) { // Runs when someone sends POST /restrict/customers
  const { name } = req.body; // Pull the real value the client sent
  const result = await pool.query(`INSERT INTO ${SCHEMA}.customers_restrict (name) VALUES ($1) RETURNING *`, [name]); // Add a new customer row
  res.status(201).json(result.rows[0]); // Send back the real new row
}

async function createOrder(req, res) { // Runs when someone sends POST /restrict/orders
  const { customerId, product } = req.body; // Pull the real values the client sent
  const result = await pool.query( // Add a new order row, pointing at a real customer
    `INSERT INTO ${SCHEMA}.orders_restrict (customer_id, product) VALUES ($1, $2) RETURNING *`,
    [customerId, product]
  );
  res.status(201).json(result.rows[0]); // Send back the real new row
}

async function deleteCustomer(req, res) { // Runs when someone sends DELETE /restrict/customers/:id — the real, blocked delete
  try { // Try the real DELETE — Postgres itself checks ON DELETE RESTRICT, not this code
    const result = await pool.query(`DELETE FROM ${SCHEMA}.customers_restrict WHERE id = $1 RETURNING *`, [req.params.id]);
    if (result.rows.length === 0) { // Check whether Postgres actually found and removed a row
      return res.status(404).json({ error: "No customer with that id." });
    }
    res.json(result.rows[0]); // The delete genuinely succeeded — this customer had no orders left pointing at it
  } catch (err) { // Postgres rejected the DELETE — most likely the real RESTRICT constraint firing
    if (err.code === "23503") { // "23503" is Postgres's own real error code for "foreign_key_violation"
      return res.status(409).json({ // 409 ("conflict") — this customer still has real orders pointing at it
        error: `Cannot delete customer ${req.params.id}: a real order still points at it (ON DELETE RESTRICT).`,
      });
    }
    throw err; // Any other kind of real error: let Express 5's own automatic forwarding handle it
  }
}

async function reset(req, res) { // Runs when someone sends DELETE /restrict/reset — clears both tables for a fresh run
  await pool.query(`DELETE FROM ${SCHEMA}.orders_restrict`); // Orders must go first — customers_restrict still has real rows referencing it otherwise
  await pool.query(`DELETE FROM ${SCHEMA}.customers_restrict`); // Now customers can be cleared safely
  res.json({ reset: true });
}

module.exports = { createCustomer, createOrder, deleteCustomer, reset }; // Share these 4 functions so routes/restrict.routes.js can use them

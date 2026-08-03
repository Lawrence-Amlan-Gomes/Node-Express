// This is the customers.controller.js file for the "InnerLeftJoin"
// mini-project. What this file does: create/list/delete-all for the real
// "customers" table used by the two JOIN queries in joins.controller.js.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createCustomer(req, res) { // Runs when someone sends POST /customers
  const { name } = req.body; // Pull the real value the client sent, out of the request body
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.customers (name) VALUES ($1) RETURNING *`, // Add a new row, and send the new row back
    [name] // The real value for $1
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function listCustomers(req, res) { // Runs when someone sends GET /customers
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.customers ORDER BY id`); // Ask for every real row, oldest first
  res.json(result.rows); // Send back the real rows as JSON
}

async function deleteAllCustomers(req, res) { // Runs when someone sends DELETE /customers
  const result = await pool.query(`DELETE FROM ${SCHEMA}.customers`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createCustomer, listCustomers, deleteAllCustomers }; // Share these 3 functions so routes/customers.routes.js can use them

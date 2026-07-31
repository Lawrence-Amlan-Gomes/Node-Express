// This is the businesses.controller.js file for the "PostgresJoinGroupBy"
// mini-project. What this file does: the ONLY file that runs real SQL
// against the businesses table.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createBusiness(req, res) { // Runs when someone sends POST /businesses
  const { name } = req.body; // Pull the real value the client sent
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.businesses (name) VALUES ($1) RETURNING *`, // The SQL text: add a new row, and send the new row back
    [name] // The real value for $1 — kept separate from the SQL text
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function deleteAllBusinesses(req, res) { // Runs when someone sends DELETE /businesses
  const result = await pool.query(`DELETE FROM ${SCHEMA}.businesses`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createBusiness, deleteAllBusinesses }; // Share these 2 functions so routes/businesses.routes.js can use them

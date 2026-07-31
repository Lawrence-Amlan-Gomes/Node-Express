// This is the leads.controller.js file for the "PostgresJoinGroupBy"
// mini-project. What this file does: the ONLY file that runs real SQL
// against the leads table.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createLead(req, res) { // Runs when someone sends POST /leads
  const { businessId, status } = req.body; // Pull the real values the client sent
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.leads (business_id, status) VALUES ($1, $2) RETURNING *`, // The SQL text: add a new row, and send the new row back
    [businessId, status ?? "new"] // The real values for $1, $2 — defaults to "new" if the caller sent none
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function deleteAllLeads(req, res) { // Runs when someone sends DELETE /leads
  const result = await pool.query(`DELETE FROM ${SCHEMA}.leads`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createLead, deleteAllLeads }; // Share these 2 functions so routes/leads.routes.js can use them

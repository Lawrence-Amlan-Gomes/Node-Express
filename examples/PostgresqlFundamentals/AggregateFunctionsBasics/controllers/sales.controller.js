// This is the sales.controller.js file for the "AggregateFunctionsBasics" mini-project.
// What this file does: it is the ONLY file that talks to the real
// database. It has 4 functions — create, list all, a grouped summary,
// and delete all — the summary one runs a real GROUP BY query.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function createSale(req, res) { // Runs when someone sends POST /sales
  const { category, amount } = req.body; // Pull the real values the client sent, out of the request body
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.sales (category, amount) VALUES ($1, $2) RETURNING *`, // The SQL text: add a new row, and send it back
    [category, amount] // The real values for $1 and $2
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function listSales(req, res) { // Runs when someone sends GET /sales
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.sales ORDER BY id`); // Ask for every real row, oldest first
  res.json(result.rows); // Send back the real rows as JSON
}

async function salesSummary(req, res) { // Runs when someone sends GET /sales/summary
  // Send this next command to the real Postgres server (comment sits above, since everything after an opening backtick is part of the string)
  const result = await pool.query(`
    SELECT
      category, -- Show which real category this summary row is for
      COUNT(*) AS count, -- Count how many real rows are in this category
      SUM(amount) AS total, -- Add up every real amount in this category
      AVG(amount) AS average, -- Work out the real average amount in this category
      MIN(amount) AS min, -- Find the real smallest amount in this category
      MAX(amount) AS max -- Find the real biggest amount in this category
    FROM ${SCHEMA}.sales -- Look inside our real "sales" table
    GROUP BY category -- Make one real summary row PER category, instead of one row for everything
    ORDER BY category -- Show the real summary rows in alphabetical order by category
  `); // This closing backtick ends the SQL command we are sending
  res.json(result.rows); // Send back the real summary rows as JSON
}

async function deleteAllSales(req, res) { // Runs when someone sends DELETE /sales
  const result = await pool.query(`DELETE FROM ${SCHEMA}.sales`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createSale, listSales, salesSummary, deleteAllSales }; // Share these 4 functions so routes/sales.routes.js can use them

// This is the books.controller.js file for the "RawSqlCrud" mini-project.
// What this file does: it is the ONLY file that talks to the real
// database. It has 6 functions — create, list all, get one, update,
// delete one, and delete all — all real, parameterized SQL, no ORM.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

// THE MISTAKE, shown only as a comment, never actually run in this
// project: building a query by gluing request data straight into the SQL
// string, e.g. `SELECT * FROM books WHERE title = '${req.query.title}'`.
// Verified directly (off to the side, not shipped here): sending a title
// like `x' OR '1'='1` this way returns EVERY row in the table, not zero —
// the attacker-supplied text gets read as real SQL, not as a plain value.
// Every real query below instead uses a $1/$2 placeholder for every value,
// which pg sends to Postgres separately from the SQL text — a value can
// never be interpreted as part of the query that way, full stop.

async function createBook(req, res) { // Runs when someone sends POST /books
  const { title, author, publishedYear } = req.body; // Pull the real values the client sent, out of the request body
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.books (title, author, published_year) VALUES ($1, $2, $3) RETURNING *`, // The SQL text: add a new row, and send the new row back
    [title, author, publishedYear] // The real values for $1, $2, $3 — kept separate from the SQL text
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function listBooks(req, res) { // Runs when someone sends GET /books
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.books ORDER BY id`); // Ask for every real row, oldest first
  res.json(result.rows); // Send back the real rows as JSON
}

async function getBook(req, res) { // Runs when someone sends GET /books/:id
  const result = await pool.query(`SELECT * FROM ${SCHEMA}.books WHERE id = $1`, [req.params.id]); // Ask for the one real row matching this id
  if (result.rows.length === 0) { // Check whether Postgres actually found a matching row
    return res.status(404).json({ error: "No book with that id." }); // If not, send back status 404 ("not found") and stop here
  }
  res.json(result.rows[0]); // Send back the real matching row as JSON
}

async function updateBook(req, res) { // Runs when someone sends PATCH /books/:id
  const { title, author, publishedYear } = req.body; // Pull the real new values the client sent
  const result = await pool.query( // Send an UPDATE command to the database and wait for the real answer
    `UPDATE ${SCHEMA}.books SET title = $1, author = $2, published_year = $3 WHERE id = $4 RETURNING *`, // The SQL text: change the matching row, and send it back
    [title, author, publishedYear, req.params.id] // The real values for $1, $2, $3, $4
  );
  if (result.rows.length === 0) { // Check whether Postgres actually found and changed a row
    return res.status(404).json({ error: "No book with that id." }); // If not, send back status 404 ("not found") and stop here
  }
  res.json(result.rows[0]); // Send back the real, now-updated row as JSON
}

async function deleteBook(req, res) { // Runs when someone sends DELETE /books/:id
  const result = await pool.query(`DELETE FROM ${SCHEMA}.books WHERE id = $1 RETURNING *`, [req.params.id]); // Remove the one real matching row
  if (result.rows.length === 0) { // Check whether Postgres actually found and removed a row
    return res.status(404).json({ error: "No book with that id." }); // If not, send back status 404 ("not found") and stop here
  }
  res.json(result.rows[0]); // Send back the real row that was just deleted
}

async function deleteAllBooks(req, res) { // Runs when someone sends DELETE /books
  const result = await pool.query(`DELETE FROM ${SCHEMA}.books`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createBook, listBooks, getBook, updateBook, deleteBook, deleteAllBooks }; // Share these 6 functions so routes/books.routes.js can use them

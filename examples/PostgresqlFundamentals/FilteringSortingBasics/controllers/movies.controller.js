// This is the movies.controller.js file for the "FilteringSortingBasics" mini-project.
// What this file does: it is the ONLY file that talks to the real
// database. It builds one real, safe SQL query out of whatever real
// filter/sort/pagination options show up in the URL's query string.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

// A fixed, trusted list of the only sort options this API allows. This
// matters for a real, specific reason: a $1/$2 placeholder can only ever
// stand in for a real VALUE (a string, a number) — it can NOT stand in for
// a column name or ASC/DESC, since those are part of the query's own
// structure, not a value being compared. Picking from this fixed list by
// key is what keeps req.query.sort from ever touching the SQL text
// directly, while still letting the real column/direction vary safely.
const SORT_OPTIONS = { // Start the list of the only sort choices this API understands
  rating_desc: "rating DESC", // If sort=rating_desc, order by rating from highest to lowest
  rating_asc: "rating ASC", // If sort=rating_asc, order by rating from lowest to highest
  year_desc: "release_year DESC", // If sort=year_desc, order by release year from newest to oldest
  year_asc: "release_year ASC", // If sort=year_asc, order by release year from oldest to newest
}; // End of the sort-options list

async function createMovie(req, res) { // Runs when someone sends POST /movies
  const { title, genre, rating, releaseYear } = req.body; // Pull the real values the client sent, out of the request body
  const result = await pool.query( // Send an INSERT command to the database and wait for the real answer
    `INSERT INTO ${SCHEMA}.movies (title, genre, rating, release_year) VALUES ($1, $2, $3, $4) RETURNING *`, // The SQL text: add a new row, and send it back
    [title, genre, rating, releaseYear] // The real values for $1, $2, $3, $4
  );
  res.status(201).json(result.rows[0]); // Send back status 201 ("created") plus the real new row as JSON
}

async function listMovies(req, res) { // Runs when someone sends GET /movies with any real query-string options
  const { genre, minRating, sort, limit, offset } = req.query; // Pull the real, optional filter/sort/paging values out of the URL

  const conditions = []; // Start an empty list to collect each real WHERE condition we need
  const params = []; // Start an empty list to collect each real value that goes with a $N placeholder

  if (genre) { // Only add this condition if a real genre value was actually given
    params.push(genre); // Add the real genre value to our list of values
    conditions.push(`genre = $${params.length}`); // Add a real condition that points at the placeholder we just added
  }
  if (minRating) { // Only add this condition if a real minRating value was actually given
    params.push(minRating); // Add the real minRating value to our list of values
    conditions.push(`rating >= $${params.length}`); // Add a real condition that points at the placeholder we just added
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""; // Join every real condition with AND, or use nothing if there are none

  const orderClause = `ORDER BY ${SORT_OPTIONS[sort] ?? "id"}`; // Look up the real, safe sort text, or fall back to ordering by id

  const limitNum = Math.min(Number(limit) || 10, 50); // Turn the real limit into a number, defaulting to 10, and never above 50
  const offsetNum = Number(offset) || 0; // Turn the real offset into a number, defaulting to 0
  params.push(limitNum, offsetNum); // Add the real limit and offset values to our list of values

  const sql = `SELECT * FROM ${SCHEMA}.movies ${whereClause} ${orderClause} LIMIT $${params.length - 1} OFFSET $${params.length}`; // Build the one real, final SQL command out of every real piece above
  const result = await pool.query(sql, params); // Send that real command to the database, with the real values, and wait for the answer
  res.json(result.rows); // Send back the real matching rows as JSON
}

async function deleteAllMovies(req, res) { // Runs when someone sends DELETE /movies
  const result = await pool.query(`DELETE FROM ${SCHEMA}.movies`); // Remove every real row from the table
  res.json({ deletedCount: result.rowCount }); // Send back how many real rows were actually removed
}

module.exports = { createMovie, listMovies, deleteAllMovies }; // Share these 3 functions so routes/movies.routes.js can use them

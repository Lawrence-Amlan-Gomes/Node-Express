// This is the db.js file for the "PostgresConnectionAndTypes" mini-project.
// What this file does: it opens ONE real, shared connection to the real
// Postgres server, and remembers this mini-project's own schema name.
// Every other file (setup.js, the controller) asks THIS file for the
// pool and the schema, instead of opening their own separate connection.
const { Pool } = require("pg"); // Load the "pg" library, the tool we use to talk to Postgres

const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // Open one real, reusable connection pool, using the real address saved in .env

const SCHEMA = process.env.PG_SCHEMA; // Read this mini-project's own private area name (schema) from .env

module.exports = { pool, SCHEMA }; // Share "pool" and "SCHEMA" so other files in this folder can use them

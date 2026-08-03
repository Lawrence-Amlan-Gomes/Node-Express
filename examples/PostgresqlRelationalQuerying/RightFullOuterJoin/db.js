// This is the db.js file for the "RightFullOuterJoin" mini-project.
// What this file does: opens one real, shared connection to Postgres, and
// reads this mini-project's own private area name (schema) from .env.
const { Pool } = require("pg"); // Load the "pg" library, the tool we use to talk to Postgres

const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // Open one real, reusable connection pool

const SCHEMA = process.env.PG_SCHEMA; // Read this mini-project's own private area name (schema) from .env

module.exports = { pool, SCHEMA }; // Share "pool" and "SCHEMA" so other files in this folder can use them

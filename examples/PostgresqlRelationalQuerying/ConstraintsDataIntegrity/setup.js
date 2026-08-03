// This is the setup.js file for the "ConstraintsDataIntegrity" mini-project.
// What this file does: run once by hand (npm run setup) — makes this
// mini-project's own schema, then 5 real tables, one pair per constraint
// this section proves: ON DELETE RESTRICT, ON DELETE CASCADE, and one
// table carrying both a real CHECK and a real UNIQUE constraint.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const { pool, SCHEMA } = require("./db"); // Get the shared connection and this project's schema name from db.js

async function main() { // Start the main function, and pause on each "await" until it finishes
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`); // Ask Postgres to make our own private area, only if it does not exist yet

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.customers_restrict ( -- The "parent" table for the RESTRICT demo
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.orders_restrict ( -- The "child" table for the RESTRICT demo
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES ${SCHEMA}.customers_restrict(id) ON DELETE RESTRICT, -- ON DELETE RESTRICT: Postgres REFUSES to delete a customer row while this still points at it
      product TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.customers_cascade ( -- The "parent" table for the CASCADE demo
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.orders_cascade ( -- The "child" table for the CASCADE demo
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES ${SCHEMA}.customers_cascade(id) ON DELETE CASCADE, -- ON DELETE CASCADE: deleting a customer row automatically deletes every order that points at it too
      product TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.products ( -- One real table carrying both a CHECK and a UNIQUE constraint
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE, -- UNIQUE: Postgres refuses a second real row with the exact same name
      price NUMERIC(10,2) NOT NULL CHECK (price > 0) -- CHECK: Postgres refuses any real row where this condition is false
    )
  `);

  console.log(`Real schema "${SCHEMA}" and 5 real tables are ready.`); // Print a message so we can see it worked
  await pool.end(); // Close the connection to the database, since this script is finished
}

main().catch((err) => { // Run the function above, and catch it here if anything goes wrong
  console.error("SETUP FAILED:", err.message); // Print the real error message so we know what broke
  process.exit(1); // Stop the program and mark it as failed
});

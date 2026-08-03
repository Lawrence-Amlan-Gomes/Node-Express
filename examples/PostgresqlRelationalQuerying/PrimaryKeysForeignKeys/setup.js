// This is the setup.js file for the "PrimaryKeysForeignKeys" mini-project.
// What this file does: run once by hand (npm run setup) — makes this
// mini-project's own schema, then two real, related tables: "customers"
// and "orders", where every order points back at one real customer.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const { pool, SCHEMA } = require("./db"); // Get the shared connection and this project's schema name from db.js

async function main() { // Start the main function, and pause on each "await" until it finishes
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`); // Ask Postgres to make our own private area, only if it does not exist yet

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.customers ( -- Make a new table called "customers", only if it is not there already
      id SERIAL PRIMARY KEY, -- The PRIMARY KEY: counts up by itself, and Postgres guarantees no two rows can ever share one
      name TEXT NOT NULL, -- A "name" column that can never be left empty
      email TEXT NOT NULL -- An "email" column that can never be left empty
    )
  `); // This closing backtick ends the SQL command we are sending

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.orders ( -- Make a new table called "orders", only if it is not there already
      id SERIAL PRIMARY KEY, -- Its OWN primary key — unrelated to the customer's id
      customer_id INTEGER NOT NULL REFERENCES ${SCHEMA}.customers(id), -- The FOREIGN KEY: must match a real id already in customers, or Postgres refuses the row
      product TEXT NOT NULL -- A "product" column that can never be left empty
    )
  `); // This closing backtick ends the SQL command we are sending

  console.log(`Real schema "${SCHEMA}" and real tables "customers"/"orders" are ready.`); // Print a message so we can see it worked
  await pool.end(); // Close the connection to the database, since this script is finished
}

main().catch((err) => { // Run the function above, and catch it here if anything goes wrong
  console.error("SETUP FAILED:", err.message); // Print the real error message so we know what broke
  process.exit(1); // Stop the program and mark it as failed
});

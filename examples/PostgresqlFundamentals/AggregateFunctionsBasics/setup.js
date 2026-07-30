// This is the setup.js file for the "AggregateFunctionsBasics" mini-project.
// What this file does: same overall shape as setup.js in
// "PostgresConnectionAndTypes" (run once by hand, makes a schema, then a
// table) — the new part here is the "sales" table, made for real
// COUNT/SUM/AVG/MIN/MAX and GROUP BY.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const { pool, SCHEMA } = require("./db"); // Get the shared connection and this project's schema name from db.js

async function main() { // Start the main function, and pause on each "await" until it finishes
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`); // Ask Postgres to make our own private area, only if it does not exist yet

  // Send this next command to the real Postgres server (comment sits above, since everything after an opening backtick is part of the string)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.sales ( -- Make a new table called "sales", only if it is not there already
      id SERIAL PRIMARY KEY, -- Make an "id" column that counts up by itself and is the unique key for each row
      category TEXT NOT NULL, -- Make a "category" column for plain text that can never be left empty
      amount NUMERIC(10,2) NOT NULL -- Make an "amount" column for a decimal number (like 19.99) that can never be left empty
    ) -- This closing bracket ends the list of columns
  `); // This closing backtick ends the SQL command we are sending

  console.log(`Real schema "${SCHEMA}" and real table "sales" are ready.`); // Print a message so we can see it worked
  await pool.end(); // Close the connection to the database, since this script is finished
}

main().catch((err) => { // Run the function above, and catch it here if anything goes wrong
  console.error("SETUP FAILED:", err.message); // Print the real error message so we know what broke
  process.exit(1); // Stop the program and mark it as failed
});

// This is the setup.js file for the "PostgresConnectionAndTypes" mini-project.
// What this file does: you run it ONE TIME by hand (npm run setup). It
// creates this mini-project's own private area (schema) and a real table
// with 5 different column types inside the real Postgres server, so the
// server.js/demo.js files have a real table to use afterward.
require("dotenv").config({ quiet: true }); // Load the real values from .env (like DATABASE_URL) into this program
const { pool, SCHEMA } = require("./db"); // Get the shared connection and this project's schema name from db.js

async function main() { // Start the main function, and pause other code until each "await" below finishes
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`); // Ask Postgres to make our own private area, only if it does not exist yet

  // Send this next command to the real Postgres server (this comment sits above, not after the backtick below, because everything after an opening backtick is part of the string, not a JS comment)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.products ( -- Make a new table called "products" inside our private area, only if it is not there already
      id SERIAL PRIMARY KEY, -- Make an "id" column that counts up by itself (1, 2, 3...) and is the unique key for each row
      name TEXT NOT NULL, -- Make a "name" column for plain text that can never be left empty
      price NUMERIC(10,2) NOT NULL, -- Make a "price" column for a decimal number (like 19.99) that can never be left empty
      in_stock BOOLEAN DEFAULT true, -- Make an "in_stock" column for true/false, starting as true when not given
      created_at TIMESTAMP DEFAULT NOW() -- Make a "created_at" column that saves the exact moment a row was made
    ) -- This closing bracket ends the list of columns
  `); // This closing backtick ends the SQL command we are sending

  console.log(`Real schema "${SCHEMA}" and real table "products" are ready.`); // Print a message so we can see it worked
  await pool.end(); // Close the connection to the database, since this script is finished
}

main().catch((err) => { // Run the function above, and catch it here if anything goes wrong
  console.error("SETUP FAILED:", err.message); // Print the real error message so we know what broke
  process.exit(1); // Stop the program and mark it as failed
});

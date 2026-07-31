// This is the setup.js file for the "PostgresJoinGroupBy" mini-project.
// What this file does: run once by hand (npm run setup) — makes this
// mini-project's own private area (schema), then two real, related tables
// (businesses, leads) plus a real index on leads.business_id, exactly the
// column Metaora's own JOIN query joins on.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const { pool, SCHEMA } = require("./db"); // Get the shared connection and this project's schema name from db.js

async function main() { // Start the main function, and pause on each "await" until it finishes
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`); // Ask Postgres to make our own private area, only if it does not exist yet

  // Send this next command to the real Postgres server (comment sits above, since everything after an opening backtick is part of the string)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.businesses ( -- Make a new table called "businesses", only if it is not there already
      id SERIAL PRIMARY KEY, -- Make an "id" column that counts up by itself and is the unique key for each row
      name TEXT NOT NULL -- Make a "name" column for plain text that can never be left empty
    )
  `); // This closing backtick ends the SQL command we are sending

  // Send this next command to the real Postgres server (comment sits above, since everything after an opening backtick is part of the string)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA}.leads ( -- Make a new table called "leads", only if it is not there already
      id SERIAL PRIMARY KEY, -- Make an "id" column that counts up by itself and is the unique key for each row
      status TEXT NOT NULL DEFAULT 'new', -- Make a "status" column, defaulting to 'new' when nothing is sent
      business_id INTEGER NOT NULL REFERENCES ${SCHEMA}.businesses(id) -- A real foreign key — every lead MUST belong to a real, existing business
    )
  `); // This closing backtick ends the SQL command we are sending

  // Send this next command to the real Postgres server — the exact real
  // index Metaora's own question ("what an index on leads.business_id
  // does for this query") is asking about.
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_leads_business_id -- Name this index so Postgres can find/drop it later
    ON ${SCHEMA}.leads (business_id) -- Build it on the exact column the JOIN below matches on
  `); // This closing backtick ends the SQL command we are sending

  console.log(`Real schema "${SCHEMA}", real tables "businesses"/"leads", and the real index are ready.`); // Print a message so we can see it worked
  await pool.end(); // Close the connection to the database, since this script is finished
}

main().catch((err) => { // Run the function above, and catch it here if anything goes wrong
  console.error("SETUP FAILED:", err.message); // Print the real error message so we know what broke
  process.exit(1); // Stop the program and mark it as failed
});

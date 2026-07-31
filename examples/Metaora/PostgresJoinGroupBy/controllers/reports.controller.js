// This is the reports.controller.js file for the "PostgresJoinGroupBy"
// mini-project. What this file does: the ONLY file that runs the real
// JOIN + GROUP BY queries — the whole point of this section.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

// Handles GET /reports/recovered-leads-by-business — Metaora's own exact
// query, run for real. An INNER JOIN (plain "JOIN" defaults to INNER in
// Postgres) only keeps a business row if it has AT LEAST ONE matching
// lead row — a business with zero leads never appears at all here.
async function recoveredLeadsByBusiness(req, res) {
  const result = await pool.query(` -- Send this real report query to Postgres
    SELECT b.name, COUNT(l.id) AS recovered_leads -- One real row per business: its name, and how many recovered leads it has
    FROM ${SCHEMA}.businesses b -- Start from the real businesses table, aliased "b"
    JOIN ${SCHEMA}.leads l ON l.business_id = b.id -- INNER JOIN: only keep businesses that have a matching lead row
    WHERE l.status = 'recovered' -- Only count leads whose real status is "recovered"
    GROUP BY b.name -- Collapse all matching lead rows into one real summary row per business name
    ORDER BY recovered_leads DESC -- Highest real recovered-lead count first
  `); // This closing backtick ends the SQL command we are sending
  res.json(result.rows); // Send back the real summary rows as JSON
}

// Handles GET /reports/all-businesses-lead-counts — the SAME real shape,
// but with a LEFT JOIN instead. A LEFT JOIN keeps EVERY business row from
// the left-hand table, even ones with zero matching leads — those get a
// real 0 instead of vanishing from the result entirely.
async function allBusinessesLeadCounts(req, res) {
  const result = await pool.query(` -- Send this real report query to Postgres
    SELECT b.name, COUNT(l.id) AS recovered_leads -- Same shape as the INNER JOIN version above
    FROM ${SCHEMA}.businesses b -- Start from the real businesses table, aliased "b"
    LEFT JOIN ${SCHEMA}.leads l ON l.business_id = b.id AND l.status = 'recovered' -- LEFT JOIN: keep every business, matching only its recovered leads
    GROUP BY b.name -- Collapse into one real row per business name, even ones with zero matches
    ORDER BY recovered_leads DESC -- Highest real recovered-lead count first
  `); // This closing backtick ends the SQL command we are sending
  res.json(result.rows); // Send back the real summary rows as JSON — including any business showing 0
}

// Handles GET /reports/explain-join — asks Postgres for its own real query
// plan on the exact report query above, proving (not just describing) what
// the real index on leads.business_id actually does for it.
async function explainJoin(req, res) {
  const result = await pool.query(` -- Ask Postgres to EXPLAIN this query instead of running it for real rows
    EXPLAIN
    SELECT b.name, COUNT(l.id) AS recovered_leads
    FROM ${SCHEMA}.businesses b
    JOIN ${SCHEMA}.leads l ON l.business_id = b.id
    WHERE l.status = 'recovered'
    GROUP BY b.name
    ORDER BY recovered_leads DESC
  `); // This closing backtick ends the SQL command we are sending
  res.json(result.rows.map((row) => row["QUERY PLAN"])); // Send back the real plan, one real line per array entry
}

module.exports = { recoveredLeadsByBusiness, allBusinessesLeadCounts, explainJoin }; // Share these 3 functions so routes/reports.routes.js can use them

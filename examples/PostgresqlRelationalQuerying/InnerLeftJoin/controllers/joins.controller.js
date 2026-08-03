// This is the joins.controller.js file for the "InnerLeftJoin"
// mini-project. What this file does: the ONLY two real queries this whole
// section is about — the exact same two tables, combined two different
// real ways, proving INNER JOIN and LEFT JOIN return genuinely different
// rows.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function innerJoinCustomersOrders(req, res) { // Runs when someone sends GET /customers/inner-join-orders
  const result = await pool.query(`
    SELECT customers.name, orders.product
    FROM ${SCHEMA}.customers
    JOIN ${SCHEMA}.orders ON customers.id = orders.customer_id -- only keep a customer row if it has a REAL matching order
    ORDER BY customers.id
  `); // A customer with zero orders never appears here at all
  res.json(result.rows); // Send back the real joined rows as JSON
}

async function leftJoinCustomersOrders(req, res) { // Runs when someone sends GET /customers/left-join-orders
  const result = await pool.query(`
    SELECT customers.name, orders.product
    FROM ${SCHEMA}.customers
    LEFT JOIN ${SCHEMA}.orders ON customers.id = orders.customer_id -- keep EVERY customer row, matched order or not
    ORDER BY customers.id
  `); // A customer with zero orders still appears here, with "product" coming back as null
  res.json(result.rows); // Send back the real joined rows as JSON
}

module.exports = { innerJoinCustomersOrders, leftJoinCustomersOrders }; // Share these 2 functions so routes/joins.routes.js can use them

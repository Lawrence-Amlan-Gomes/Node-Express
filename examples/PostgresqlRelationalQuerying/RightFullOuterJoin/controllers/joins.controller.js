// This is the joins.controller.js file for the "RightFullOuterJoin"
// mini-project. What this file does: the 2 real queries this section is
// about, run FROM orders this time (not customers), proving RIGHT JOIN and
// FULL OUTER JOIN each keep a different, genuinely real set of rows.
const { pool, SCHEMA } = require("../db"); // Get the shared database connection and our private area name

async function rightJoinOrdersCustomers(req, res) { // Runs when someone sends GET /orders/right-join-customers
  const result = await pool.query(`
    SELECT orders.product, customers.name
    FROM ${SCHEMA}.orders
    RIGHT JOIN ${SCHEMA}.customers ON orders.customer_id = customers.id -- keep EVERY row from customers (the table on the right), matched or not
    ORDER BY customers.id
  `); // A guest order (customer_id null) has no customer to attach to, so it is left out entirely — same idea as INNER JOIN, just from the other side
  res.json(result.rows); // Send back the real joined rows as JSON
}

async function fullOuterJoinOrdersCustomers(req, res) { // Runs when someone sends GET /orders/full-outer-join-customers
  const result = await pool.query(`
    SELECT orders.product, customers.name
    FROM ${SCHEMA}.orders
    FULL OUTER JOIN ${SCHEMA}.customers ON orders.customer_id = customers.id -- keep EVERY row from BOTH tables, matched or not
    ORDER BY customers.id
  `); // Now the guest order reappears too, with "name" coming back as null — nothing from either side is lost
  res.json(result.rows); // Send back the real joined rows as JSON
}

module.exports = { rightJoinOrdersCustomers, fullOuterJoinOrdersCustomers }; // Share these 2 functions so routes/orders.routes.js can use them

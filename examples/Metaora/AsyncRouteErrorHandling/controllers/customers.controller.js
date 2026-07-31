// This is the customers.controller.js file for the "AsyncRouteErrorHandling"
// mini-project. What this file does: the ONE real route below is written
// to match Metaora's own interview snippet almost exactly (findUnique,
// 404 on a real miss, next(err) on a real thrown error) — the only file
// that talks to Prisma at all.
const { PrismaClient } = require("@prisma/client"); // Load Prisma's real, generated client

const prisma = new PrismaClient(); // A real Prisma client, shared by every handler below

// Handles POST /customers — real seeding, so there's a real row to look up.
async function createCustomer(req, res) {
  const { name, email } = req.body; // Pull the real values the client sent
  const created = await prisma.customer.create({ data: { name, email } }); // A real INSERT
  res.status(201).json(created); // 201 means "created"
}

// Handles GET /customers/:id — THIS is Metaora's own snippet, almost
// verbatim. The whole point: wrap every real "await" in try/catch, and
// forward any real thrown error to next(err) instead of letting it crash
// silently or hang the request.
async function getCustomer(req, res, next) {
  try { // Start watching for a real thrown error on every line below
    const id = Number(req.params.id); // req.params.id always arrives as a string — Number() converts it
    // If the real id in the URL isn't a number at all (e.g. "/customers/abc"),
    // Number() produces NaN here — and Prisma genuinely REJECTS NaN as an
    // Int argument, throwing a real PrismaClientValidationError below. This
    // is the real error this whole section exists to catch correctly.
    const customer = await prisma.customer.findUnique({ where: { id } }); // A real SELECT by primary key
    if (!customer) return res.status(404).json({ error: "Not found" }); // A real, expected "no row" case — not an error, just a 404
    res.json(customer); // Send back the real matching row as JSON
  } catch (err) { // Runs ONLY if something above actually threw for real
    next(err); // Hand the real error to server.js's central error-handling middleware — never swallow it here
  }
}

// Handles DELETE /customers — clears every real row, so this project's own
// verification (Postman/pgAdmin) can reset between runs through the API
// itself, never by reaching around it straight into Prisma.
async function deleteAllCustomers(req, res) {
  const result = await prisma.customer.deleteMany(); // A real bulk DELETE
  res.json({ deletedCount: result.count }); // Tell the caller how many real rows were removed
}

module.exports = { createCustomer, getCustomer, deleteAllCustomers }; // Share these 3 functions so routes/customers.routes.js can use them

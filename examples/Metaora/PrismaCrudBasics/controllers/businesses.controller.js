// This is the businesses.controller.js file for the "PrismaCrudBasics"
// mini-project. What this file does: the ONLY file that runs real Prisma
// calls against the Business table.
const { PrismaClient } = require("@prisma/client"); // Load Prisma's real, generated client

const prisma = new PrismaClient(); // A real Prisma client, shared by every handler below

// Handles POST /businesses.
async function createBusiness(req, res) {
  const { name } = req.body; // Pull the real name the client sent
  const created = await prisma.business.create({ data: { name } }); // A real INSERT
  res.status(201).json(created); // 201 means "created"
}

// Handles DELETE /businesses — clears every real row, so this project's
// own verification can reset between runs through the API itself.
async function deleteAllBusinesses(req, res) {
  const result = await prisma.business.deleteMany(); // A real bulk DELETE
  res.json({ deletedCount: result.count }); // Tell the caller how many real rows were removed
}

module.exports = { createBusiness, deleteAllBusinesses }; // Share these 2 functions so routes/businesses.routes.js can use them

// This is the leads.controller.js file for the "PrismaCrudBasics"
// mini-project. What this file does: the ONLY file that runs real Prisma
// calls against the Lead table — the 4 functions below are Metaora's own
// interview snippet (create / findMany-with-where-and-include / update /
// delete), each turned into one real Express handler.
const { PrismaClient } = require("@prisma/client"); // Load Prisma's real, generated client

const prisma = new PrismaClient(); // A real Prisma client, shared by every handler below

// Handles POST /leads — Metaora's own "create" example.
async function createLead(req, res) {
  const { name, phone, businessId } = req.body; // Pull the real values the client sent
  const created = await prisma.lead.create({ // A real INSERT
    data: { name, phone, businessId, status: "new" }, // Every real new lead starts life as "new" — exactly Metaora's snippet
  });
  res.status(201).json(created); // 201 means "created"
}

// Handles GET /leads (optionally ?status=missed_call) — Metaora's own
// "findMany with a filter + relation" example.
async function listLeads(req, res) {
  const { status } = req.query; // Read the real, optional ?status= value from the URL
  const leads = await prisma.lead.findMany({ // A real SELECT, filtered and joined by Prisma itself
    where: status ? { status } : undefined, // Only filter by status if the caller actually sent one
    include: { business: true }, // Also load each lead's real, related Business row — one extra real query Prisma runs for you
  });
  res.json(leads); // Send back the real rows (each with a real nested "business" object) as JSON
}

// Handles PATCH /leads/:id — Metaora's own "update" example.
async function updateLeadStatus(req, res) {
  const { status } = req.body; // Pull the real new status the client sent
  const updated = await prisma.lead.update({ // A real UPDATE, by primary key
    where: { id: Number(req.params.id) }, // req.params.id always arrives as a string — Number() converts it
    data: { status }, // e.g. "recovered" — exactly Metaora's snippet
  });
  res.json(updated); // Send back the real, now-updated row as JSON
}

// Handles DELETE /leads/:id — Metaora's own "delete" example.
async function deleteLead(req, res) {
  const deleted = await prisma.lead.delete({ where: { id: Number(req.params.id) } }); // A real DELETE, by primary key
  res.json(deleted); // Send back the real row that was just deleted
}

// Handles DELETE /leads — clears every real row, so this project's own
// verification can reset between runs through the API itself.
async function deleteAllLeads(req, res) {
  const result = await prisma.lead.deleteMany(); // A real bulk DELETE
  res.json({ deletedCount: result.count }); // Tell the caller how many real rows were removed
}

module.exports = { createLead, listLeads, updateLeadStatus, deleteLead, deleteAllLeads }; // Share these 5 functions so routes/leads.routes.js can use them

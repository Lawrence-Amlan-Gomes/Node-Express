// The real Prisma $transaction calls live here — the routes file never
// talks to Prisma directly, only this controller does.
const { PrismaClient } = require("@prisma/client");

// A real Prisma client for this section's own Account table.
const prisma = new PrismaClient();

// Handles POST /accounts/reset — clears the table and seeds two fresh
// real accounts, so every demo run (or Postman try) starts from the
// exact same known state.
async function resetAccounts(req, res) {
  // Clean up anything left over from a previous run first.
  await prisma.account.deleteMany();
  // Insert the two real accounts this transfer story needs.
  const alice = await prisma.account.create({ data: { name: "Alice", balance: 100 } });
  const bob = await prisma.account.create({ data: { name: "Bob", balance: 0 } });
  res.status(201).json([alice, bob]);
}

// Handles GET /accounts.
async function listAccounts(req, res) {
  // A real SELECT of both accounts, in a stable, readable order.
  const accounts = await prisma.account.findMany({ orderBy: { id: "asc" } });
  res.json(accounts);
}

// Handles POST /accounts/transfer. A "transaction" groups multiple real
// database operations into ONE all-or-nothing unit: either every
// operation in it succeeds and gets permanently saved together, or — if
// ANY step fails — the database undoes every step in that transaction
// as if none of them ever ran.
async function transfer(req, res) {
  // The real amount to move from Alice to Bob, straight from the request body.
  const amount = req.body.amount;
  // Real lookups — this demo only ever has one Alice and one Bob.
  const alice = await prisma.account.findFirstOrThrow({ where: { name: "Alice" } });
  const bob = await prisma.account.findFirstOrThrow({ where: { name: "Bob" } });

  try {
    // prisma.$transaction with a callback runs every query inside it
    // against the SAME real database transaction — if the callback
    // finishes without throwing, both writes below commit together for real.
    await prisma.$transaction(async (tx) => {
      // Read Alice's real, current balance from inside the transaction.
      const currentAlice = await tx.account.findUniqueOrThrow({ where: { id: alice.id } });
      // Real write — debits Alice for real, even if this ends up rolled back.
      await tx.account.update({ where: { id: alice.id }, data: { balance: { decrement: amount } } });

      if (currentAlice.balance - amount < 0) {
        // Throw on purpose — this is what forces the whole transaction to roll back.
        throw new Error("Insufficient balance — this transaction must not be allowed to commit.");
      }

      // Only reached if the balance check above passed.
      await tx.account.update({ where: { id: bob.id }, data: { balance: { increment: amount } } });
    });
    // The transaction really committed — report the real success.
    res.json({ message: `Transferred ${amount} from Alice to Bob`, amount });
  } catch (err) {
    // The transaction really rolled back — report the real, forced failure.
    res.status(400).json({ error: err.message });
  }
}

// Handles DELETE /accounts — clears every real account, with no reseed.
// Used by demo.js to leave the table exactly as it was found (empty) when
// it's done, since this is a real shared database, not a throwaway local one.
async function deleteAllAccounts(req, res) {
  const result = await prisma.account.deleteMany();
  res.json({ deletedCount: result.count });
}

module.exports = { resetAccounts, listAccounts, transfer, deleteAllAccounts };

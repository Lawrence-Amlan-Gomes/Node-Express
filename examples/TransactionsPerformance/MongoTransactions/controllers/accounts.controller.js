// The real Mongoose session.withTransaction calls live here — the
// routes file never talks to Mongoose directly, only this controller does.
const mongoose = require("mongoose");
const Account = require("../account-model");

// Handles POST /accounts/reset — clears the collection and seeds two
// fresh real accounts, so every demo run (or Postman try) starts from
// the exact same known state.
async function resetAccounts(req, res) {
  // Clean up anything left over from a previous run first.
  await Account.deleteMany({});
  // Insert the two real accounts this transfer story needs.
  const alice = await Account.create({ name: "Alice", balance: 100 });
  const bob = await Account.create({ name: "Bob", balance: 0 });
  res.status(201).json([alice, bob]);
}

// Handles GET /accounts.
async function listAccounts(req, res) {
  // A real query of both accounts, in a stable, readable order.
  const accounts = await Account.find().sort({ name: 1 });
  res.json(accounts.map((a) => ({ name: a.name, balance: a.balance })));
}

// Handles POST /accounts/transfer. MongoDB has its own real
// multi-document ACID transactions (since MongoDB 4.0) — a transaction
// needs a real "session" object, and every operation inside it must be
// told which session it belongs to.
async function transfer(req, res) {
  // The real amount to move from Alice to Bob, straight from the request body.
  const amount = req.body.amount;
  // Real lookups — this demo only ever has one Alice and one Bob.
  const alice = await Account.findOne({ name: "Alice" });
  const bob = await Account.findOne({ name: "Bob" });

  // A real session is required for a real multi-document transaction.
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Read Alice's real, current balance from inside the transaction.
      const currentAlice = await Account.findById(alice._id, null, { session });
      // Real write — debits Alice for real, even if this ends up rolled back.
      await Account.updateOne({ _id: alice._id }, { $inc: { balance: -amount } }, { session });

      if (currentAlice.balance - amount < 0) {
        // Throw on purpose — this is what forces the whole transaction to roll back.
        throw new Error("Insufficient balance — this transaction must not be allowed to commit.");
      }

      // Only reached if the balance check above passed.
      await Account.updateOne({ _id: bob._id }, { $inc: { balance: amount } }, { session });
    });
    // The transaction really committed — report the real success.
    res.json({ message: `Transferred ${amount} from Alice to Bob`, amount });
  } catch (err) {
    // The transaction really rolled back — report the real, forced failure.
    res.status(400).json({ error: err.message });
  } finally {
    // Always close this real session, whether the transaction succeeded or failed.
    await session.endSession();
  }
}

// Handles DELETE /accounts — clears every real account, with no reseed.
// Used by demo.js to leave the collection exactly as it was found
// (empty) when it's done, since this is a real shared database, not a
// throwaway local one.
async function deleteAllAccounts(req, res) {
  const result = await Account.deleteMany({});
  res.json({ deletedCount: result.deletedCount });
}

module.exports = { resetAccounts, listAccounts, transfer, deleteAllAccounts };

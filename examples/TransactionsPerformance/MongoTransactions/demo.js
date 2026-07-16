// MongoDB has its own real multi-document ACID transactions (since
// MongoDB 4.0) — this proves the exact same all-or-nothing guarantee as
// the Postgres transactions example, against a real remote MongoDB
// Atlas cluster. A transaction needs a real "session" object, and every
// operation inside it must be told which session it belongs to.
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const Account = require("./account-model");

async function main() {
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
  await Account.deleteMany({});

  const alice = await Account.create({ name: "Alice", balance: 100 });
  const bob = await Account.create({ name: "Bob", balance: 0 });

  // SUCCESSFUL transaction: transfer 50 from Alice to Bob. Every write
  // below passes { session } so MongoDB knows it's part of the SAME
  // real transaction — if the callback finishes without throwing, both
  // writes commit together for real.
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    await Account.updateOne({ _id: alice._id }, { $inc: { balance: -50 } }, { session });
    await Account.updateOne({ _id: bob._id }, { $inc: { balance: 50 } }, { session });
  });
  await session.endSession();

  const afterSuccess = await Account.find().sort({ name: 1 });
  console.log("AFTER SUCCESSFUL TRANSFER (50 from Alice to Bob):");
  console.log(afterSuccess.map((a) => ({ name: a.name, balance: a.balance })));

  // FAILED transaction: try to transfer 500 more from Alice, who now
  // only has 50. A real balance check throws on purpose, AFTER the
  // first write already ran inside the transaction, to prove MongoDB
  // really rolls back BOTH writes, not just stops where it is.
  const session2 = await mongoose.startSession();
  try {
    await session2.withTransaction(async () => {
      const currentAlice = await Account.findById(alice._id, null, { session: session2 });
      await Account.updateOne({ _id: alice._id }, { $inc: { balance: -500 } }, { session: session2 });

      if (currentAlice.balance - 500 < 0) {
        throw new Error("Insufficient balance — this transaction must not be allowed to commit.");
      }

      await Account.updateOne({ _id: bob._id }, { $inc: { balance: 500 } }, { session: session2 });
    });
  } catch (err) {
    console.log(`\nFORCED FAILURE (real, on purpose): ${err.message}`);
  } finally {
    await session2.endSession();
  }

  const afterFailure = await Account.find().sort({ name: 1 });
  console.log("\nAFTER THE FAILED TRANSFER — both balances unchanged from before, including Alice's, even though her debit ran first inside the transaction:");
  console.log(afterFailure.map((a) => ({ name: a.name, balance: a.balance })));

  await Account.deleteMany({});
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

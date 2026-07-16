// A "transaction" groups multiple real database operations into ONE
// all-or-nothing unit: either every operation in it succeeds and gets
// permanently saved together, or — if ANY step fails — the database
// undoes every step in that transaction as if none of them ever ran.
// This proves BOTH real outcomes, against a real remote Postgres.
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.account.deleteMany();

  const alice = await prisma.account.create({ data: { name: "Alice", balance: 100 } });
  const bob = await prisma.account.create({ data: { name: "Bob", balance: 0 } });

  // SUCCESSFUL transaction: transfer 50 from Alice to Bob. prisma.$transaction
  // with a callback runs every query inside it against the SAME real
  // database transaction — if the callback finishes without throwing,
  // both writes below commit together for real.
  await prisma.$transaction(async (tx) => {
    await tx.account.update({ where: { id: alice.id }, data: { balance: { decrement: 50 } } });
    await tx.account.update({ where: { id: bob.id }, data: { balance: { increment: 50 } } });
  });

  const afterSuccess = await prisma.account.findMany({ orderBy: { id: "asc" } });
  console.log("AFTER SUCCESSFUL TRANSFER (50 from Alice to Bob):");
  console.log(afterSuccess);

  // FAILED transaction: try to transfer 500 more from Alice, who now
  // only has 50 — a real balance check inside the transaction throws a
  // real error on purpose, deliberately AFTER the first write already
  // ran, to prove Prisma really rolls back BOTH writes, not just stops
  // where it is.
  try {
    await prisma.$transaction(async (tx) => {
      const currentAlice = await tx.account.findUniqueOrThrow({ where: { id: alice.id } });
      await tx.account.update({ where: { id: alice.id }, data: { balance: { decrement: 500 } } });

      if (currentAlice.balance - 500 < 0) {
        throw new Error("Insufficient balance — this transaction must not be allowed to commit.");
      }

      await tx.account.update({ where: { id: bob.id }, data: { balance: { increment: 500 } } });
    });
  } catch (err) {
    console.log(`\nFORCED FAILURE (real, on purpose): ${err.message}`);
  }

  const afterFailure = await prisma.account.findMany({ orderBy: { id: "asc" } });
  console.log("\nAFTER THE FAILED TRANSFER — both balances unchanged from before, including Alice's, even though her debit ran first inside the transaction:");
  console.log(afterFailure);

  await prisma.account.deleteMany();
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

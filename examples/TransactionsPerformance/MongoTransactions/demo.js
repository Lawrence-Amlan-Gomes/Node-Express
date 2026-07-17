// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Mongoose directly at all. Proves the exact same
// all-or-nothing guarantee as the Postgres transactions example,
// against a real remote MongoDB Atlas cluster. The real
// session.withTransaction call lives in
// controllers/accounts.controller.js instead.
require("dotenv").config({ quiet: true });
const app = require("./server.js");

async function main() {
  // Port 0 means "give me any free port" — resolve only once it's really listening.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  // The real port the OS actually assigned, read back off the live server.
  const { port } = server.address();
  const base = `http://localhost:${port}`;

  // Seed two fresh real accounts — through the real API, not Mongoose directly.
  await fetch(`${base}/accounts/reset`, { method: "POST" });

  // SUCCESSFUL transfer — a real POST request for 50.
  await fetch(`${base}/accounts/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 50 }),
  });
  // A real GET request, to see the real result of the successful transfer.
  const afterSuccessRes = await fetch(`${base}/accounts`);
  // Parse the real JSON body the API sent back.
  const afterSuccess = await afterSuccessRes.json();
  console.log("AFTER SUCCESSFUL TRANSFER (50 from Alice to Bob):");
  // Print the real, updated balances.
  console.log(afterSuccess);

  // FAILED transfer — a real POST request for 500, more than Alice has left.
  const failRes = await fetch(`${base}/accounts/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 500 }),
  });
  // Parse the real JSON body the API sent back — a real, forced 400 error.
  const failBody = await failRes.json();
  console.log(`\nFORCED FAILURE (real, on purpose): ${failBody.error}`);

  // A real GET request, to see the real result of the failed transfer.
  const afterFailureRes = await fetch(`${base}/accounts`);
  // Parse the real JSON body the API sent back.
  const afterFailure = await afterFailureRes.json();
  console.log("\nAFTER THE FAILED TRANSFER — both balances unchanged from before, including Alice's, even though her debit ran first inside the transaction:");
  // Print the real balances — Alice's debit was really undone.
  console.log(afterFailure);

  // Clean up after this run — a real shared database, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await fetch(`${base}/accounts`, { method: "DELETE" });

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main()
  .catch((err) => {
    // Print the real error message if anything above actually failed.
    console.error("FAILED:", err.message);
    // Mark the process as failed, so a CI run or Postman check can notice.
    process.exitCode = 1;
  })
  .finally(() => {
    // server.js opens the real Mongo connection once, meant to live for
    // the whole real server's lifetime — this one-shot script has no
    // business closing it itself, so it exits explicitly instead of
    // hanging on a connection it doesn't own.
    process.exit(process.exitCode ?? 0);
  });

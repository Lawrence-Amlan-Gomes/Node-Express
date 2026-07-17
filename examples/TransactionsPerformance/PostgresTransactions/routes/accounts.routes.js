// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Prisma code lives here at all.
const { Router } = require("express");
const { resetAccounts, listAccounts, transfer, deleteAllAccounts } = require("../controllers/accounts.controller");

// A mini version of "app" — mounted at "/accounts" by server.js.
const router = Router();

// POST /accounts/reset — seeds two fresh real accounts.
router.post("/reset", resetAccounts);
// GET /accounts — lists both real accounts and their real balances.
router.get("/", listAccounts);
// POST /accounts/transfer — runs a real, all-or-nothing transaction.
router.post("/transfer", transfer);
// DELETE /accounts — clears every real account (used by demo.js to leave the table empty when done).
router.delete("/", deleteAllAccounts);

module.exports = router;

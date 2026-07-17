// A real, minimal Mongoose model for this section's own transfer story —
// just a name and a balance, nothing else needed to prove a transaction.
const mongoose = require("mongoose");

// The real schema — no relationship to anything else, on purpose.
const accountSchema = new mongoose.Schema({
  name: String,
  balance: Number,
});

// Pins this section's own real, separate collection name.
module.exports = mongoose.model("TxnAccount", accountSchema, "learning_accounts_txn");

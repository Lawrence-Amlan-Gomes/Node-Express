// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Prisma code lives here at all.
import { Router } from "express";
import { resetCustomers, searchCustomer, createIndex, deleteAllCustomers } from "../controllers/customers.controller.js";

// A mini version of "app" — mounted at "/customers" by server.js.
const router = Router();

// POST /customers/reset — drops any leftover index, then seeds 100,000 fresh real rows.
router.post("/reset", resetCustomers);
// GET /customers/search — runs the same real query; the result depends on whether an index exists yet.
router.get("/search", searchCustomer);
// POST /customers/index — creates a real B-tree index on the email column.
router.post("/index", createIndex);
// DELETE /customers — drops the real index and clears the real table (used by demo.js to clean up).
router.delete("/", deleteAllCustomers);

export default router;

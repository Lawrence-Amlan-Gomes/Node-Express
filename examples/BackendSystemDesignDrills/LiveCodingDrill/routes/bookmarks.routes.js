// A routes file's only job: declare which path+method maps to which
// controller function. Reading this file should tell you every endpoint
// this resource has, at a glance, with zero actual logic in the way.
import { Router } from "express";
import { createBookmark, listBookmarks, getBookmark, deleteBookmark } from "../controllers/bookmarks.controller.js";

// A mini version of "app" — server.js mounts this at "/bookmarks".
const router = Router();

// POST /bookmarks — create a real bookmark, validated by zod.
router.post("/", createBookmark);
// GET /bookmarks?limit=&cursor= — cursor-paginated list.
router.get("/", listBookmarks);
// GET /bookmarks/:id — one real bookmark, or a real 404.
router.get("/:id", getBookmark);
// DELETE /bookmarks/:id — remove one real bookmark, or a real 404.
router.delete("/:id", deleteBookmark);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;

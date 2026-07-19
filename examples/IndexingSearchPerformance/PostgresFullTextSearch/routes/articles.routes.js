// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Prisma code lives here at all.
import { Router } from "express";
import {
  resetArticles,
  searchArticles,
  createSearchIndex,
  searchArticlesIndexed,
  deleteAllArticles,
} from "../controllers/articles.controller.js";

// A mini version of "app" — mounted at "/articles" by server.js.
const router = Router();

// POST /articles/reset — drops any leftover search column/index, then seeds 50,000 fresh real rows.
router.post("/reset", resetArticles);
// GET /articles/search — the BEFORE version: to_tsvector(body) computed live, no index.
router.get("/search", searchArticles);
// POST /articles/index — adds a real generated tsvector column and a real GIN index on it.
router.post("/index", createSearchIndex);
// GET /articles/search-indexed — the AFTER version: matches the indexed column, with real ts_rank ranking.
router.get("/search-indexed", searchArticlesIndexed);
// DELETE /articles — drops the real index/column and clears the real table (used by demo.js to clean up).
router.delete("/", deleteAllArticles);

export default router;

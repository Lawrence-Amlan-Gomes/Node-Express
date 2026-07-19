// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no AWS SDK code lives here at all.
import { Router } from "express";
import { createUploadUrl, listPhotos, deleteAllPhotos } from "../controllers/photos.controller.js";

// A mini version of "app" — mounted at "/photos" by server.js.
const router = Router();

// POST /photos/upload-url — generates a real, time-limited presigned PUT URL.
router.post("/upload-url", createUploadUrl);
// GET /photos — lists every real object under this example's own dedicated prefix.
router.get("/", listPhotos);
// DELETE /photos — clears every real object under this example's own prefix (used by demo.js to clean up).
router.delete("/", deleteAllPhotos);

export default router;

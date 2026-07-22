// A routes file's only job: declare which path+method maps to which
// controller function. Two tiny routers here — one per real app version —
// so server.js can mount each behind its own real port.
import { Router } from "express";
import { getProfileV1, getProfileV2 } from "../controllers/profile.controller.js";

// The v1 router — GET /profile returns the ORIGINAL, honored shape.
export const profileRouterV1 = Router();
profileRouterV1.get("/profile", getProfileV1);

// The v2 router — GET /profile returns the real, silently-renamed shape.
export const profileRouterV2 = Router();
profileRouterV2.get("/profile", getProfileV2);

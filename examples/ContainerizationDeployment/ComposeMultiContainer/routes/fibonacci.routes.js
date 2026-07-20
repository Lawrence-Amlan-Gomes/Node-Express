import { Router } from "express";
import { getFibonacci, clearFibonacci } from "../controllers/fibonacci.controller.js";

const router = Router();

router.get("/fib/:n", getFibonacci);
router.delete("/fib/:n", clearFibonacci);

export default router;

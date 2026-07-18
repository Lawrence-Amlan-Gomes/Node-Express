// A single, shared pino logger instance — a real backend creates ONE
// logger like this (usually in its own file, exactly like this one) and
// imports it everywhere logging is needed, instead of calling
// console.log scattered across the codebase.
import pino from "pino";

// The real, default pino instance — real, structured JSON on every
// call, with a real timestamp, level, and process id already attached.
export const logger = pino();

// The same real, shared pino logger pattern as the first section — one
// instance, imported everywhere logging is needed.
import pino from "pino";

// The real, default pino instance.
export const logger = pino();

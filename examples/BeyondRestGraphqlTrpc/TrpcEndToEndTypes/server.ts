import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { pathToFileURL } from "node:url";

// Every tRPC server starts from this real, shared builder object.
const t = initTRPC.create();

// This service's own real data — same shape as the REST/GraphQL sections,
// for a genuine apples-to-apples comparison.
const USERS = [{ id: "1", name: "Lawrence" }];

// A real "router" — one real procedure, "getUser". The zod schema below
// is BOTH the real runtime input validation AND, through TypeScript
// inference, the real compile-time type a client gets for free.
const appRouter = t.router({
  getUser: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return USERS.find((u) => u.id === input.id) ?? null;
  }),
});

// The ONLY thing this file ever hands to a client — a real TypeScript
// TYPE, not a value. It costs nothing at runtime; it exists purely for
// the compiler to check against.
export type AppRouter = typeof appRouter;

// A real, standalone HTTP server — tRPC needs no Express at all here,
// though it can sit behind Express too when that's useful.
const server = createHTTPServer({ router: appRouter });

const PORT = process.env.PORT ? Number(process.env.PORT) : 4117;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  server.listen(PORT, () => {
    const address = server.address();
    const boundPort = typeof address === "object" && address !== null ? address.port : PORT;
    console.log(`Listening on port ${boundPort}`);
  });
}

export { server };

import { createTRPCClient, httpBatchLink } from "@trpc/client";
// "import type" — this line is REAL TypeScript syntax that only ever
// exists at compile time. Node's own type-stripping deletes it entirely
// before running this file, so at RUNTIME this client imports zero real
// code from server.ts — only the shape of it, checked by the compiler.
import type { AppRouter } from "./server.ts";

const port = process.argv[2];

// <AppRouter> below is what gives every call on `client` real,
// compiler-checked autocomplete — TypeScript already knows "getUser"
// exists, what input it needs, and what it returns, all inferred from
// the real server code, without a single hand-written type here.
const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: `http://localhost:${port}` })],
});

const user = await client.getUser.query({ id: "1" });
console.log(`Real result, fully typed end to end: ${JSON.stringify(user)}`);

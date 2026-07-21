// Deliberately wrong, on purpose — kept isolated via tsconfig.errordemo.json
// (see that file), never part of this project's real build or the real
// demo.js run. This file is never executed; it exists only so `tsc` can
// really check it and produce a real, captured error, matching the same
// pattern already used in TypeScriptWithNode/TypedBackendSetup.
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./server.ts";

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:4117" })],
});

// THE MISTAKE: the server's own zod schema says id is a real string —
// this passes a number instead. No suppression, no assertion — left as a
// real, genuine type error so tsc can actually catch it for real.
const user = await client.getUser.query({ id: 1 });
console.log(user);

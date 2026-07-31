// Deliberately wrong, on purpose — kept isolated via tsconfig.errordemo.json
// (see that file), never part of this project's real typecheck or ever
// actually run. This file exists only so a real "tsc" run can genuinely
// catch and report the mistake below, matching the same pattern already
// used in TypeScriptWithNode/TypedBackendSetup and
// BeyondRestGraphqlTrpc/TrpcEndToEndTypes.
import type { Lead } from "./lead.ts";
import { updateStatus } from "./update-status.ts";

const lead: Lead = { id: "lead_1", status: "new" };

// THE MISTAKE: "archived" is not one of Lead's real 3 status values ("new"
// | "contacted" | "recovered") — T is inferred as Lead from the first
// argument, so TypeScript genuinely rejects this second argument. No
// suppression, no assertion — a real type error, left in for tsc to catch.
const updated = updateStatus(lead, "archived");
console.log(updated);

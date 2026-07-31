// This is the correct-usage.ts file for the "TypeScriptInterviewFluency"
// mini-project. What this file does: really runs updateStatus() on a real
// Lead object, proving both that the generic works AND that "import type"
// costs zero real runtime code.
import type { Lead } from "./lead.ts"; // "import type" — TypeScript checks against this, but Node deletes the line entirely before running
import { updateStatus } from "./update-status.ts"; // A real, normal import — this one really exists at runtime

const lead: Lead = { id: "lead_1", status: "new" }; // A real Lead object, starting as "new"

// T is inferred as Lead here, purely from the first real argument — so
// TypeScript already knows the second argument must be one of Lead's own
// 3 real status strings, with zero extra type annotations written here.
const updated = updateStatus(lead, "recovered"); // A real call — genuinely changes status to "recovered"

console.log(`Real result: ${JSON.stringify(updated)}`); // Print the real, updated object so this run proves it actually worked
console.log(`The original object was NOT mutated: ${JSON.stringify(lead)}`); // Print the ORIGINAL too — proves updateStatus returns a new object

// This is the lead.ts file for the "TypeScriptInterviewFluency"
// mini-project. What this file does: declares the real shape Metaora's own
// interview snippet types a Lead as — a real discriminated status union,
// not just a plain "string".
export interface Lead { // A real TypeScript interface — a contract every real Lead object must match
  id: string; // Every real Lead must have a real string id
  status: "new" | "contacted" | "recovered"; // A real UNION of exactly 3 allowed strings — nothing else is a valid status
}

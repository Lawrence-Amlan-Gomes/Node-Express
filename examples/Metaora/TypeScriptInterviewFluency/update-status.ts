// This is the update-status.ts file for the "TypeScriptInterviewFluency"
// mini-project. What this file does: Metaora's own generic-function
// snippet, kept exactly as given — real generics, constrained to any real
// object shape that has a "status" field, whatever type that field is.

// <T extends { status: string }> means: T can be ANY real object shape, as
// long as it has a real "status" property that's some kind of string.
// T["status"] then means "whatever real type T's own status field is" —
// for a real Lead (see lead.ts), that's the exact 3-value union, not just
// a plain "string" — this generic works for a Lead AND for any other real
// object shape with its own different status type, without rewriting it.
export function updateStatus<T extends { status: string }>(item: T, status: T["status"]): T {
  return { ...item, status }; // A real, brand-new object — the original "item" is never mutated
}

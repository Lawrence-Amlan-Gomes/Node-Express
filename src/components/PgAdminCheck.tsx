import CopyButton from "./CopyButton";

export interface PgAdminQueryStep {
  label: string; // what this query does, e.g. "Insert a real row"
  sql: string; // the real SQL to paste into pgAdmin4's Query Tool
  note?: string; // short, request-side context (e.g. "run this one first")
  expect: string; // plain-English description of the real, already-verified result
}

// A step-by-step "see it yourself in pgAdmin4" guide — the database-GUI
// equivalent of PostmanCheck, for topics whose whole point is real SQL
// against a real table. Self-contained on purpose: every query here
// inserts/reads its own real row directly through pgAdmin4's Query Tool,
// so it never depends on the Postman steps' own ordering or cleanup.
export default function PgAdminCheck({
  schema,
  table,
  queries,
}: {
  schema: string;
  table: string;
  queries: PgAdminQueryStep[];
}) {
  return (
    <div className="rounded-card border border-blue-500/40 bg-blue-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself in pgAdmin4</span>
      </div>

      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 mb-3 flex flex-col gap-1.5">
        <div className="text-body text-xs leading-relaxed">
          <span className="font-semibold">1. Find the real table in the tree:</span> Servers &rarr;{" "}
          <code className="text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">Node Express Learning</code>{" "}
          &rarr; Databases &rarr; postgres &rarr; Schemas &rarr;{" "}
          <code className="text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">{schema}</code>{" "}
          &rarr; Tables &rarr;{" "}
          <code className="text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">{table}</code>.
        </div>
        <div className="text-body text-xs leading-relaxed">
          <span className="font-semibold">2. Open a real SQL editor:</span> right-click the{" "}
          <code className="text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-xs">postgres</code>{" "}
          database &rarr; <span className="font-semibold">Query Tool</span>.
        </div>
        <div className="text-body text-xs leading-relaxed">
          <span className="font-semibold">3. Paste and run each real query below</span> (the &#9654; button, or F5)
          — one at a time, in order.
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {queries.map((q, i) => (
          <div key={`${i}-${q.label}`} className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs mb-1.5">
              3.{i + 1}. {q.label}
            </div>
            <div className="flex items-start gap-2">
              <pre className="flex-1 font-mono text-xs text-blue-500 bg-blue-500/10 rounded px-2 py-1.5 whitespace-pre-wrap break-all">
                {q.sql}
              </pre>
              <CopyButton text={q.sql} label="Copy SQL" className="text-blue-500 mt-1.5" />
            </div>
            {q.note && <div className="mt-2 text-xs text-sublabel leading-relaxed italic">{q.note}</div>}
            <div className="mt-2 text-xs leading-relaxed">
              <span className="text-green-500 font-semibold">Expect: </span>
              <span className="text-body">{q.expect}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

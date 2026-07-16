import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import StatusCodesVersioningRunner from "@/example-runners/RestConventionsValidation/StatusCodesVersioningRunner";
import CursorVsOffsetPaginationRunner from "@/example-runners/RestConventionsValidation/CursorVsOffsetPaginationRunner";
import IdempotencyKeysRunner from "@/example-runners/RestConventionsValidation/IdempotencyKeysRunner";
import ZodValidationRunner from "@/example-runners/RestConventionsValidation/ZodValidationRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function PaginationCostDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-yellow-500 mb-2.5">Real, measured Postgres time — fetching the SAME 20 rows from a real 100,000-row table:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">OFFSET 90000 LIMIT 20 → 15.887 ms (scans and throws away 90,020 rows first)</div>
      <div className="pl-2 mb-1.5 text-green-500">WHERE id &gt; 90000 LIMIT 20 → 0.052 ms (jumps straight there using the primary key index)</div>
      <div className="mt-2 text-muted">
        About 300 times apart, at just 100,000 rows — and OFFSET keeps getting worse the deeper you page, while the cursor query stays fast no matter how big the table gets.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Status Codes & URL-Path Versioning",
    paragraphs: [
      "A status code is a real part of an API's answer. A client can often know what happened just from that one number. It doesn't even need to look at the rest of the reply. 201 means something was really just created. 204 means the request worked, but there's really nothing to send back. 404 means this exact thing does not exist. 400 means the CLIENT sent something wrong. 500 means the SERVER itself broke.",
      "Putting the version right in the URL path — /api/v1/... — is still the best way to do it in 2026. It's easy to see. It also works well with caching. A browser or CDN can just look at the URL, with no need to check a special header.",
      "The demo below runs a real /api/v1 Express API. It prints the REAL status code sent back for each real result: a working list (200), a working create (201, with a real Location header), a rejected create with missing data (400), finding something (200) versus not finding it (404), and a working delete with a real, truly empty body (204).",
    ],
    demo: <StatusCodesVersioningRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/StatusCodesVersioning/server.js", note: "A real Express app under /api/v1, returning the correct status code for every real outcome." },
      { path: "examples/RestConventionsValidation/StatusCodesVersioning/demo.js", note: "Exercises every route and prints the real status code returned." },
    ],
  },
  {
    heading: "Cursor vs Offset Pagination",
    paragraphs: [
      "Offset pagination says \"skip the first 90,000 rows, give me the next 20.\" It's easy to write, but it does not scale. The database still has to walk through and throw away every single skipped row, every single time. The client only wanted 20 of them. Cursor pagination instead says \"give me the next 20 rows after the last one I saw.\" It uses the table's own index to jump straight to the right spot, no matter how deep into the list you are.",
      "The demo below doesn't just say this is true. It measures it, on a real remote Postgres table filled with 100,000 real rows. It uses a real Postgres tool called EXPLAIN ANALYZE, which reports the real time a query took. The real result: OFFSET 90000 costs about 300 times more than the same cursor query. The query plan even shows exactly why. The OFFSET version touches 90,020 rows just to get there. The cursor version only ever touches the 20 rows it actually returns.",
    ],
    extra: <PaginationCostDiagram />,
    demo: <CursorVsOffsetPaginationRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/CursorVsOffsetPagination/demo.js", note: "Seeds 100,000 real rows, then measures real Postgres execution time for both approaches via EXPLAIN ANALYZE." },
    ],
  },
  {
    heading: "Idempotency Keys",
    paragraphs: [
      "Here's the real problem. A client sends a request to charge a card. The charge really works on the server. But the reply never makes it back — a slow network, a dropped connection. The client doesn't know it already worked, so it tries again. Without protection, that second try makes a SECOND real charge. An idempotency key fixes this. It's just one random value the client makes up once, and sends again, unchanged, if it ever retries. This is the real pattern Stripe and PayPal actually use.",
      "The demo below proves the real result. The exact same idempotency key, sent twice, only makes ONE real charge. The server sees the repeated key and just sends back the FIRST result again, instead of charging a second time. A genuinely different key, with the same amount, does make a new charge. This proves the server is really checking that key.",
    ],
    demo: <IdempotencyKeysRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/IdempotencyKeys/server.js", note: "A real Express charge endpoint, made safe to retry via a stored Idempotency-Key map." },
      { path: "examples/RestConventionsValidation/IdempotencyKeys/demo.js", note: "Proves a retried request returns the cached result instead of double-charging." },
    ],
  },
  {
    heading: "Real Input Validation with Zod",
    paragraphs: [
      "TypeScript's types disappear the moment your code actually runs. They cannot stop a real network request from sending junk — a missing field, a string where a number should be, a broken email address. zod checks the ACTUAL shape of a request body while the app is running. You write down the shape once, and zod checks every real request against it. It gives back a clear list of what's wrong, instead of a vague \"invalid input\" message.",
      "The demo below sends a truly broken body — an empty name, a broken email, a negative age — to a real Express route. It gets back a real 400, with a real error message for each field. Then it sends a truly good body, and gets back a real 201 with the checked, clean data.",
    ],
    demo: <ZodValidationRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/ZodValidation/server.js", note: "A real zod schema validating a real Express route's request body." },
      { path: "examples/RestConventionsValidation/ZodValidation/demo.js", note: "Sends both an invalid and a valid body, proving the real 400/201 responses." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. A status code is a real part of the answer, not just decoration. 201, 204, 400, and 404 each mean one specific thing a client can act on. Putting the version in the URL path stays the standard, because it's clear and works well with caching. Offset pagination is a real, measured slowdown once a table gets big — about 300 times slower at just 100,000 rows, checked here directly. Cursor pagination fixes it by using the table's own index instead of counting rows. Idempotency keys are the real pattern Stripe and PayPal use to make a retried charge safe. Real input validation with zod checks the data TypeScript's types can't check once the app is actually running.",
    ],
    extra: (
      <>
        <FlowChain steps={["a client sends a request", "validate the body for real (zod) before touching it", "does it CREATE something? → 201, not 200", "does it need to be retry-safe? → check the Idempotency-Key first", "paginating deep? → cursor, not OFFSET"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Status codes are a real, meaningful part of an API — use 201/204/400/404 on purpose, instead of just sending 200 for everything.",
            "Offset pagination gets slower the deeper you page, because it has to scan and throw away every skipped row — reach for cursor pagination once a table gets any real size.",
            "Idempotency keys are how Stripe and PayPal make a retried charge (or any request with a real side effect) safe — the server spots a repeated key and sends back the first result again, instead of doing the action twice.",
            "zod checks real, live data while the app runs — something TypeScript's types cannot do on their own. The two work together, they don't replace each other.",
          ]}
        />
      </>
    ),
  },
];

export default function RestConventionsValidationPage() {
  return (
    <StudyPage
      title="REST Conventions & Validation"
      stageLabel="Stage D — API Design & Real-World Concerns"
      stageColor="yellow"
      intro="Four real, separate ideas about building a good API, each one proven rather than just talked about: the real status code sent back for every outcome on a real /api/v1 Express API, a measured, roughly 300x real speed gap between offset and cursor pagination on a real 100,000-row Postgres table, a real idempotency-key setup that stops a retried charge from double-billing, and real, live input checking with zod."
      sections={sections}
    />
  );
}

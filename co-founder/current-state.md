# Current State

Owned by `skillCoFounderMentor.md`. Live snapshot — always **overwrite** during `End Today`, never just append. First file read on every `@skillCoFounderMentor.md` activation.

- **Last session:** 2026-07-22, closed via `End Today`. Confirmed "Backend System Design Drills" mastered, then built and got mastered confirmation on "Working With a Frontend Team" — the LAST unbuilt topic in the entire curriculum. **Stage F is now 6/6, and the entire curriculum (31/31 topics, Stage A through F) is now mastered.**

## What happened this session, in order

1. **Confirmed "Backend System Design Drills" mastered** — the topic carried over from last session (a real, timed live-coding reference build — a Bookmarks API with cursor pagination and zod validation — plus pagination/idempotency/rate-limiting reframed as interview anchors, CAP theorem mapped onto this project's own real Postgres-vs-MongoDB-Atlas setup, sharding/consistent hashing, and the latency-numbers table).
2. **Built "Working With a Frontend Team" (Stage F's final topic)** — 4 real sections: `ContractHandshake` (two real Express apps, v1 honors a contract, v2 silently renames a field — proves the exact same frontend consumer code reads a real value from v1 and a real `undefined` from v2, no error, no failed request); `OpenApiSwaggerDocs` (a real Products API with a real OpenAPI 3.0 spec served as genuine interactive Swagger UI docs at `/docs`, plus the same spec served as raw JSON at `/openapi.json`); `MockingWithPrism` (a real Prism-generated mock server for a "Reviews" API that has ZERO real Express code behind it anywhere in this project — proving a frontend dev can start real work before the backend exists, including Prism's own automatic request validation); `ContractValidationMiddleware` (`express-openapi-validator` wired in as real, enforced middleware — a request violating the spec gets a real, automatic 400 with per-field errors before the controller ever runs, proven against wrong types, missing required fields, a below-minimum value, and an invalid path-param type).
3. **Found and fixed a real bug during build verification**: Prism's default `multiprocess` mode (an internal fork via Node's `cluster` module) crashes with `Cannot read properties of undefined (reading 'isPrimary')` specifically when Prism is spawned as a NESTED child process inside this project's own `next build` worker tree — never surfaced standalone. Fixed with `-m false`, documented in full in `build-conventions.md` (including why a generous 30s timeout, not the usual 10s, is now warranted for any demo spawning a real subprocess during a real, concurrent production build).
4. **Ran a "Start Chat / End Chat" relay session** with Lawrence's separate portfolio-tracking Claude Code instance (a different project's own cofounder/mentor) — gave a full, detailed sync of everything built and mastered in this project (every topic, real measured numbers, real gotchas, real infra decisions, current open gaps). The other side folded it into Lawrence's portfolio content (a full sync narrative + 5 new Backend-tab Skills Tracker entries: REST API Design & Security, Testing & Observability, WebSockets & Real-Time, Microservices & Scaling, GraphQL & tRPC) and confirmed it resolved an open "next topic: GraphQL" flag they'd been carrying. **This relay pattern is now a permanent, standing part of `skillCoFounderMentor.md` itself** (new Section 6, "Chat with another Claude") — triggered by `Start Chat`/`End Chat`, not a one-off improvisation.
5. Verified the same way as every other topic this project has built: real direct execution of each mini-project, a full clean `rm -rf .next && npm run build` (all 4 demos executing live during static prerendering), and a 3x concurrent-`curl` stress check on the new page — all clean, no leftover processes.

## Real infrastructure

No new *external* infra this session. New real npm dependencies, all in self-contained `examples/` mini-projects: `swagger-ui-express` + `yaml` (`OpenApiSwaggerDocs`), `@stoplight/prism-cli` (`MockingWithPrism`, devDependency), `express-openapi-validator` (`ContractValidationMiddleware`).

Highest fixed port assigned across the whole project: **4123** (`WorkingWithFrontendTeams/ContractValidationMiddleware`). Full block this session: 4119/4120 (ContractHandshake, v1/v2), 4121 (OpenApiSwaggerDocs), 4122 (MockingWithPrism), 4123 (ContractValidationMiddleware). Previously highest: 4118 (`BackendSystemDesignDrills/LiveCodingDrill`, built the session before).

## Next unbuilt / in progress

**None — the entire curriculum is complete.** Every topic across Stage A through Stage F is built, verified, and confirmed mastered (31/31 in `src/data/curriculum.ts`, dashboard shows 100%).

Next session's job is no longer "build the next topic" — it's one of the genuine open items below, or something new the user brings. Don't invent new curriculum content unprompted; raise the open items and let the user decide.

## Open gaps / weak spots

1. Carried forward, unresolved: REST Conventions, Auth Patterns, and CORS's `PostmanCheck`s still predate the exhaustive-steps/request-response-separation fixes from 2026-07-18. Still just flagged, not actioned.
2. **No actual timed mock interview has been run yet.** "Backend System Design Drills" taught and built the live-coding pattern and a real reference implementation, but the user hasn't been put under a real clock with this mentor watching/reviewing live. A natural next-session offer, not yet done.
3. Two items named in this project's own prose `roadmap.md` early on — **"observability (metrics/tracing basics)"** and **"behavioral prep narrating this project"** — never got dedicated topic cards in `src/data/curriculum.ts`, unlike every other item that started as roadmap prose (e.g. background jobs, GraphQL/tRPC both eventually got real cards). Surfaced directly to the other Claude during today's relay sync as an honest exception, not silently dropped. Worth asking the user whether either is still wanted as a real topic, now that everything else is done.

## Momentum notes carried forward

1. **Any future runner that spawns Prism (or another CLI tool that internally forks via `cluster` for its own performance) from a `demo.js` must disable that tool's own internal multiprocess/fork option from the start** (`-m false` for Prism) — confirmed this session that leaving it on crashes specifically when nested inside this project's own real `next build` worker process, never standalone.
2. Momentum notes from 2026-07-21 (proactive port-0/PID-scoping/matchAll-timeout discipline on any demo touching a shared resource or spawning a process, `npm view` before writing any new dependency version, `@types/node` + `types: ["node"]` for any new TS example referencing Node builtins, `error.stdout` for capturing an expected non-zero-exit CLI error, `demo.js` staying a thin call-and-print layer) all still stand and were applied cleanly again this session — no new instances of any of those specific bugs recurred.

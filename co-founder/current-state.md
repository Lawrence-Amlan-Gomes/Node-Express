# Current State

Owned by `skillCoFounderMentor.md`. Live snapshot — always **overwrite** during `End Today`, never just append. First file read on every `@skillCoFounderMentor.md` activation.

- **Last session:** 2026-07-31 (2nd session that date), closed via `End Today`. The user interrupted the PostgreSQL/MongoDB initiative (MongoDB Fundamentals stayed paused, not abandoned) to have a brand-new Stage G — "Company-Specific Interview Prep" — built, with its first topic, "Metaora," built directly from a real job description's 4 code snippets. Curriculum status: the original 31 topics + PostgreSQL Fundamentals remain mastered; MongoDB Fundamentals stays `in-progress`, paused mid-initiative; Metaora is `in-progress`, built and verified, awaiting the user's own mastery confirmation.

## New Stage G — Company-Specific Interview Prep (added 2026-07-31)

An open-ended stage, not a fixed 1-topic addition: one topic per real company going forward, each built from that company's own real JD/interview snippets rather than generic curriculum content. See `roadmap.md`'s new Stage G entry for the full standing pattern for future company topics.

**Topic 1, "Metaora"** — `hasPage: true`, `status: "in-progress"`. 4 real mini-projects under `examples/Metaora/`, each proving one of the JD's snippets almost verbatim:
1. **AsyncRouteErrorHandling** (port 4140, Prisma, dedicated schema `node_express_learning_metaora_async`) — a real `Customer` lookup via `GET /customers/:id`, try/catch + `next(err)`, one real central error-handling middleware (4-arg, registered last). Verified live: a real 404 on a genuine miss, AND a real thrown Prisma error (non-numeric id → Prisma genuinely rejects `NaN` as an Int argument) actually reaching the central handler and coming back as a clean, generic 500 — never leaking the raw error to the client.
2. **PrismaCrudBasics** (port 4141, Prisma, dedicated schema `node_express_learning_metaora_leads`) — a real `Business`↔`Lead` relation, all 4 of the JD's basics (`create` / `findMany` with `where`+`include` / `update` / `delete`), verified against the live Coolify Postgres server including the real joined-in business object.
3. **PostgresJoinGroupBy** (port 4142, raw `pg`, dedicated schema `node_express_learning_metaora_join`) — the JD's exact JOIN + GROUP BY report, PLUS a real LEFT JOIN twin proving the INNER-vs-LEFT difference (a business with zero recovered leads vanishes vs. shows a real 0), PLUS a real `EXPLAIN` endpoint showing Postgres's actual query plan and the real index on `leads.business_id`.
4. **TypeScriptInterviewFluency** (no server — real `tsc`-only proof) — the JD's `Lead` union type + generic `updateStatus<T extends {status:string}>` function, verified both ways: the correct call runs and returns a new object, and a deliberately wrong call is genuinely rejected by `tsc` with the exact captured error (`tsconfig.errordemo.json` isolation pattern, same as `TrpcEndToEndTypes`).

Built following every existing standing convention: one mini-project per section, dedicated schemas, no `demo.js` (new topic, built clean from the start), `PostmanCheck`/`PgAdminCheck` with copy buttons on every server-backed section, a bespoke "Try It Yourself in your own terminal" block for the server-less TypeScript section. Verified via `typecheck`/`lint`/a clean `rm -rf .next && npm run build` (39/39 pages) multiple times, plus real headless-Chromium screenshots (zero console errors) after every round of fixes below.

## Two real, direct corrections from the user this session — both now standing rules

1. **Relational data needs a real HTML table, not a card diagram (see `feedback_relational_data_needs_real_tables` memory + `build-conventions.md`).** The user compared this project's bespoke card/box diagrams directly against a real SQL YouTube tutorial and called it out bluntly ("stupid mentor... I can't see a table"). Fixed by building `src/components/DataTable.tsx` (a real `<table>`) and applying it to Metaora's JOIN section (source tables → result tables) AND retroactively to all 4 already-shipped "PostgreSQL Fundamentals" sections. **Then pushed further**: the user asked to see the actual SQL query too, not just before/after tables with no code connecting them — fixed by adding the real query (INNER JOIN vs LEFT JOIN side by side in Metaora; the real filter/`GROUP BY` query in PostgreSQL Fundamentals) directly BETWEEN each before/after table pair.
2. **Every piece of syntax shown in a code example must be taught ON THE PAGE ITSELF before the example uses it — never left for a chat follow-up (see `feedback_beginner_comments_and_demos` memory, point 9).** The user asked what the `b`/`l` table aliases in the JOIN query meant; after getting a chat-only answer, he said plainly the page itself "didn't teach at all" and that everything needs to be taught "pixel by pixel in the UI... before jumping in the code." Fixed by adding two new explicit `ConceptBreakdown` items to Metaora's JOIN section — what a table alias is, and why it removes ambiguity — BEFORE the JOIN concept itself, which now references the already-explained `b`/`l` names instead of introducing them cold.

**Both fixes are now standing rules for every future topic, not one-off patches** — the next 2 Postgres topics in the initiative ("PostgreSQL Relational Querying," "PostgreSQL Advanced Querying & Production Patterns") get real `DataTable`s + inline query code + explicit syntax-teaching built in from the start.

## Known carried-forward initiative: PostgreSQL & MongoDB fundamentals-to-advanced (paused, not abandoned)

1. PostgreSQL Fundamentals — **mastered**, and now also has the DataTable/query-code retrofit above.
2. MongoDB Fundamentals — **built and verified, paused awaiting the user's mastery confirmation** (unchanged this session — see the 2026-07-31 1st-session entry in `session-log.md` for its own build details).
3. PostgreSQL Relational Querying — not started. Real INNER/LEFT/RIGHT/FULL joins, subqueries, constraints & data integrity (FK cascade/restrict, CHECK, UNIQUE). **Build with real `DataTable`s + inline query code + explicit alias/syntax teaching from the start**, per the new standing rules above.
4. MongoDB Schema & Query Patterns — not started.
5. PostgreSQL Advanced Querying & Production Patterns — not started. Same DataTable/query-code standing rule applies once reached.
6. MongoDB Advanced Patterns & Production Concerns — not started.

**The user explicitly asked to build these ONE AT A TIME** — this remains true; Metaora was a deliberate, explicit interruption, not a change to that rule.

**Highest real fixed port across the project: 4142** (`Metaora/PostgresJoinGroupBy`) — check this before assigning new ports on the next topic, per the fixed-port-collision gotcha in `build-conventions.md`.

**Next session should start with:**
1. Check the mail inbox (root `mail-box/`) per the standing rule.
2. Ask whether the user has confirmed mastery on "Metaora" and/or "MongoDB Fundamentals" — resume whichever the user directs. If both are confirmed and no new company topic is requested, the natural next unblocked item is topic 3, "PostgreSQL Relational Querying."
3. If a new Stage G company topic is requested instead, follow the standing pattern in `roadmap.md`'s Stage G entry (real JD snippets → one mini-project per snippet → real `DataTable`s/query-code/alias-teaching from the start, no retrofitting needed later).

## Open gaps / weak spots (carried forward, still unresolved)

1. REST Conventions, Auth Patterns, and CORS's `PostmanCheck`s still predate the exhaustive-steps/request-response-separation fixes from 2026-07-18. Still just flagged, not actioned.
2. **No actual timed mock interview has ever been run with THIS mentor.** Still a standing offer whenever the user wants a genuine timed, live-reviewed exercise.
3. Two items named in `roadmap.md`'s prose early on — "observability (metrics/tracing basics)" and "behavioral prep narrating this project" — never got dedicated topic cards. Still unresolved.
4. A sibling project, **URL Shortener** (real, deployed, its own Claude Code cofounder), is known to exist — see `learner-profile.md`. Its 5 self-flagged bugs were reported fixed via that project's own cofounder, not verified from here.
5. **New this session:** the DataTable/query-code/alias-teaching fixes above have ONLY been applied to Metaora and PostgreSQL Fundamentals so far — MongoDB Fundamentals, Connecting Real Databases, Migrations & Schema Design, Transactions & Query Performance, and Indexing & Search Performance still have their older card-diagram-only treatment for any relational/tabular content they show. Not yet actioned — revisit only if the user asks for a broader retroactive pass.

## Momentum notes carried forward

1. Forcing a real container replacement in a test/demo: don't rely on `docker compose up --force-recreate` alone — force a genuine IP difference via a second container sharing the same `--network-alias` before removing the original (see `build-conventions.md`).
2. A service that fails by refusing/timing out a TCP connect doesn't have deterministic failure timing unless a connect timeout is explicitly configured — treat multiple plausible failure status codes as the same real bug.
3. Standing habits still in force from earlier sessions: proactive port-0/PID-scoping/matchAll-timeout discipline, `npm view` before writing any new dependency version, `@types/node` + `types: ["node"]` for TS examples referencing Node builtins, `error.stdout` for expected non-zero-exit CLI errors, disabling a spawned CLI tool's own internal multiprocess/fork option from the start.
4. A `/bp:judge` (Cavekit) slash command was invoked mid-session by accident/muscle memory — correctly a no-op here, since this project has no Cavekit `context/impl` structure. Not a real gap, just noting it happened in case it recurs.

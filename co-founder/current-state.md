# Current State

Owned by `skillCoFounderMentor.md`. Live snapshot — always **overwrite** during `End Today`, never just append. First file read on every `@skillCoFounderMentor.md` activation.

- **Last session:** 2026-07-31, closed via `End Today`. Finished two carried-over items from 2026-07-30 (the demo.js-removal sweep, a new copy-button standing rule), then — once the user confirmed "PostgreSQL Fundamentals" mastered — built and verified "MongoDB Fundamentals" (topic 2 of the 6-topic PostgreSQL/MongoDB initiative) in full. Curriculum status: the original 31 topics remain mastered, plus "PostgreSQL Fundamentals" now mastered too; the 6-topic initiative is 2/6 built (topic 2 awaiting its own mastery confirmation).

## New standing rules adopted this session (all now in `skillCoFounderMentor.md` / `build-conventions.md` — read those for full detail, this is just an index)

1. **Cross-project mail protocol** (`skillCoFounderMentor.md` Section 7) — root `mail-box/` folder is the inbox, checked/cleared at every session start; `co-founder/mail-recipients.md` lists outbox destinations (currently: MySelf, JobCrack, Lawrence Amlan Gomes). Mail goes out FIRST on every `End Today`. **First real mail was sent this session** (a detailed session-summary to all 3 recipients) — confirm on next activation that the local inbox is still empty (nothing should have come back yet, but check per the standing rule).
2. **Work silently, report after** (`skillCoFounderMentor.md` Section 3) — no progress narration while executing; report once done. Applies starting the NEXT session (this rule was given mid-session, so this session itself still narrated normally).
3. **`End Today` auto-runs the git flow** (`skillCoFounderMentor.md` Section 5) — no longer needs a separate `@skillGit.md` invocation.
4. **Every coding file needs a top-of-file "what this file does" comment, and every single code line its own same-line plain-English comment** (`build-conventions.md`) — stricter than the older per-statement rule. Repeated logic across files gets a short "same pattern as X" reference instead of full repetition. Gotcha: inside a multi-line SQL template-literal string, use SQL's `--` comment syntax, never `//` (which would corrupt the query). Applied so far only to the 4 "PostgreSQL Fundamentals" mini-projects — not retroactive to older topics.
5. **No more `demo.js` + "Live Output from Real Code" wherever a `PostmanCheck` (or equivalent manual-walkthrough component) already verifies the server** (`build-conventions.md`, full rule and exemption list there) — real backend projects never ship a `demo.js`; Postman-style manual verification is the practice worth reinforcing instead. Applied going forward AND as a full retroactive sweep — **COMPLETE as of 2026-07-31, all 24 pages swept, see below.**
6. **Every real command/URL/JSON body/SQL query inside a "Try It Yourself" guide gets a copy-to-clipboard button** (added 2026-07-31, `build-conventions.md`) — new `src/components/CopyButton.tsx`, wired into the shared `PostmanCheck`/`PgAdminCheck` components (covers all usages automatically) plus every bespoke hand-rolled walkthrough block project-wide. Standing rule for any new "Try It Yourself" content going forward.

## New curriculum initiative: PostgreSQL & MongoDB each get a full intro-to-advanced progression

Not just the existing side-by-side comparison topics — six new Stage C topics added to `curriculum.ts` (see `roadmap.md`'s 2026-07-30 entry for full placement rationale), interleaved chronologically with existing Stage C topics:

1. **PostgreSQL Fundamentals** (`postgresql-fundamentals`) — after "SQL vs NoSQL" — **BUILT AND MASTERED, confirmed by the user 2026-07-31**
2. **MongoDB Fundamentals** (`mongodb-fundamentals`) — after topic 1 — **BUILT, see below, awaiting mastery confirmation**
3. **PostgreSQL Relational Querying** (`postgresql-relational-querying`) — after "Migrations & Schema Design" — not started
4. **MongoDB Schema & Query Patterns** (`mongodb-schema-query-patterns`) — after topic 3 — not started
5. **PostgreSQL Advanced Querying & Production Patterns** (`postgresql-advanced-querying`) — after "Indexing & Search Performance" — not started
6. **MongoDB Advanced Patterns & Production Concerns** (`mongodb-advanced-patterns`) — after topic 5 — not started

**The user explicitly asked to build these ONE AT A TIME** — build one, wait for "done studying," then build the next. **Do not start "PostgreSQL Relational Querying" until the user says so.**

### Topic 2, "MongoDB Fundamentals" — built 2026-07-31, verified, awaiting mastery confirmation

`hasPage: true`, `status: "in-progress"`. 4 real mini-projects under `examples/MongodbFundamentals/`, native `mongodb` driver (no ODM — deliberate, "Connecting Real Databases" is where Mongoose appears), each its own dedicated Atlas collection (database `express`, same cluster every other Mongo-touching topic already uses):
1. **MongoConnectionAndDocuments** (port 4130, collection `mongofund_types_products`) — 6 real BSON field types, runtime `describeType()` introspection (no fixed schema to ask instead, unlike Postgres's `information_schema`) — real, meaningful contrast: a `Double` field comes back as a genuine JS `number`, not a string (no NUMERIC-precision reason to protect against, unlike Postgres)
2. **RawMongoCrud** (port 4131, collection `mongofund_crud_books`) — full CRUD (`insertOne`/`findOne`/`find`/`findOneAndUpdate`/`findOneAndDelete`) on a real "books" collection, including the real `ObjectId` conversion gotcha (a URL string never equals a real `_id` without explicit `new ObjectId(id)`, which itself throws on a malformed string — caught, not crashed)
3. **FilteringSortingBasics** (port 4132, collection `mongofund_filter_movies`) — real filter/sort/limit/skip built field-by-field from query-string params, with the real NoSQL-injection gotcha documented (`find(req.query)` is a genuine vulnerability — a query string like `?genre[$ne]=null` parses into a real Mongo operator object)
4. **AggregationBasics** (port 4133, collection `mongofund_aggregate_sales`) — real `$group` pipeline (`$sum`/`$avg`/`$min`/`$max`), same 5 sales/2-category numbers as Postgres Fundamentals' own aggregate section, for a direct side-by-side — unlike Postgres's `COUNT(*)`/`NUMERIC`-as-string, every number here comes back as a genuine JS number.

Deliberately has **no `demo.js`/example-runners at all** — built AFTER the demo.js-removal sweep, so it started clean with the new standing rule (Postman verification only) rather than needing a later retroactive pass. Also has **no `setup.js`** — MongoDB makes a collection automatically on first insert, no `CREATE TABLE` equivalent needed; this omission is itself called out as a real, deliberate teaching contrast in the section's own prose. No `PgAdminCheck`-equivalent yet (Mongo Compass would be the analogous GUI — not built, no request for it so far, see `build-conventions.md`).

Every request/response pair in every `PostmanCheck` was curled for real against the live Atlas cluster before being written into the page (see the session's own curl transcripts) — nothing fabricated. `npm run typecheck`, `npm run lint`, and a clean `rm -rf .next && npm run build` all passed clean (38/38 pages) immediately after. Verified live in a real headless-Chromium screenshot too (page renders correctly, copy buttons present automatically via the shared `PostmanCheck` component, zero console/page errors).

### Topic 1, "PostgreSQL Fundamentals" — built, verified, mastered

`hasPage: true`, `status: "mastered"`. 4 real mini-projects under `examples/PostgresqlFundamentals/`, raw `pg` driver (no ORM — deliberate, "Connecting Real Databases" is where Prisma appears), each its own dedicated schema on the real Coolify Postgres server:
1. **PostgresConnectionAndTypes** (port 4126) — 5 real column types, the pg-driver-returns-NUMERIC-as-a-string gotcha
2. **RawSqlCrud** (port 4127) — full parameterized CRUD on a real "books" table
3. **FilteringSortingBasics** (port 4128) — real WHERE/ORDER BY/LIMIT/OFFSET from query-string params
4. **AggregateFunctionsBasics** (port 4129) — real GROUP BY + COUNT/SUM/AVG/MIN/MAX

Also added: `PgAdminCheck.tsx` component (a pgAdmin4 "Try It Yourself" guide, parallel to `PostmanCheck`) on all 4 sections — the user's real pgAdmin4 server connection is named "Node Express Learning" in their tree. New standing rule: any future Postgres-writing section gets one of these too.

**Mid-build, the comment-density rule (item 4 above) landed** — all 4 mini-projects' `.js` files were fully rewritten with the new per-line-comment standard and re-verified (`node setup.js`/`node demo.js` re-run, correct output). **Then the no-more-`demo.js` rule (item 5) landed** — this topic's own `demo.js`/runners/Live-Output blocks were removed too, same as every other swept topic (see below).

Two real environment gotchas found/fixed 2026-07-30, now in `build-conventions.md`: all 94 `examples/**` mini-projects had lost their own `node_modules` (fresh-machine state) — reinstalled; `staticPageGenerationTimeout: 180` added to `next.config.ts` (cold concurrent-build load exceeded Next's default 60s budget).

## The `demo.js` retroactive removal sweep — COMPLETE (2026-07-31)

Per rule 5 above. All 24 `PostmanCheck`-bearing topic pages fully swept (demo.js deleted, runner `.tsx` deleted, `demo`/`demoCommand` JSX props + any FilePointer referencing demo.js removed from `page.tsx`, unused runner import removed, `package.json`'s `"demo"` script + stale `"main": "demo.js"` fixed). The final 6 (`websockets-realtime`, `background-jobs-queues`, `microservices-vs-monolith`, `beyond-rest-graphql-trpc`, `backend-system-design`, `working-with-frontend-teams`) were finished 2026-07-31, completing the pass started 2026-07-30.

**Correctly left alone:** `testing-express` (its "Live Output" is a real Jest `npm test` run, not `demo.js` — genuinely different, real production practice, exempted by design) — and, across the swept pages, individual sections that have no Postman/manual-verification alternative at all (e.g. `logging-observability`'s "Catching Uncaught Errors" section, `caching-scaling`'s `CacheStampede`/`DistributedLock`/`WorkerThreadsCpu` sections, `debugging-memory-profiling`'s heap-snapshot/Clinic.js sections, `deployment-containers`'s "What Even IS a Container?" section) — these correctly KEPT their `demo.js`.

`typecheck`/`lint`/a clean `rm -rf .next && npm run build` all passed 37/37 immediately after the sweep finished — **~14s**, down from ~83-90s pre-sweep, confirming the removed auto-executing runners were the real cause of the dev-mode slowness noted below. New topics built AFTER this point (MongoDB Fundamentals) start clean with no `demo.js` at all, rather than needing this sweep applied retroactively later.

## Copy-button standing rule — COMPLETE (2026-07-31)

Per standing rule 6 above. New `src/components/CopyButton.tsx` (click → clipboard, checkmark for 1.5s). Wired into the shared `PostmanCheck.tsx`/`PgAdminCheck.tsx` components, which covers all 24 + 1 real usages project-wide automatically. Then swept every bespoke, hand-rolled "Try It Yourself" block that doesn't use those shared components (7 pages: `websockets-realtime`, `background-jobs-queues`, `microservices-vs-monolith`, `beyond-rest-graphql-trpc`, `debugging-memory-profiling`, `caching-scaling`, `deployment-containers`) — every literal command/URL/JSON/multi-line shell sequence got its own adjacent button; placeholder values needing real substitution (e.g. `kill -9 <the real pid>`) were deliberately skipped. One real bug caught and fixed during live verification (traced to a flaw in the verification script's own Playwright locator re-resolution, not the component — see `build-conventions.md`'s entry for the full story). Verified live via headless-Chromium screenshot + a real clipboard readback proving the exact real string gets copied.

## Known open issue — resolved by the demo.js sweep

The Next.js DEV server (unlike the production build) used to re-execute every real remote-database demo on every page load with no caching — a cold `/topics/postgresql-fundamentals` load measured 45 seconds to 5+ minutes in dev mode, and the dev process crashed once under that load, before the sweep. Removing the auto-executing real-DB/process-spawning runners (now that the sweep is complete) is confirmed the real cause, not just plausibly related — build times dropped ~6x. Not separately re-measured for dev-mode load times since the sweep finished, but no further slowness reported.

**Next session should start with:**
1. Check the mail inbox (root `mail-box/`) per the standing rule.
2. If the user confirms "MongoDB Fundamentals" mastered, start building topic 3, "PostgreSQL Relational Querying" (real INNER/LEFT/RIGHT/FULL joins, subqueries, constraints & data integrity — FK cascade/restrict, CHECK, UNIQUE) — same one-mini-project-per-section conventions, no `demo.js`/runners (build clean from the start, matching MongoDB Fundamentals' pattern), `PostmanCheck` + `PgAdminCheck` on every real Postgres-writing section, copy buttons come for free via the shared components.
3. Otherwise, continue wherever the user directs.

## Open gaps / weak spots (carried forward, still unresolved)

1. REST Conventions, Auth Patterns, and CORS's `PostmanCheck`s still predate the exhaustive-steps/request-response-separation fixes from 2026-07-18. Still just flagged, not actioned.
2. **No actual timed mock interview has ever been run with THIS mentor.** Still a standing offer whenever the user wants a genuine timed, live-reviewed exercise.
3. Two items named in `roadmap.md`'s prose early on — "observability (metrics/tracing basics)" and "behavioral prep narrating this project" — never got dedicated topic cards. Still unresolved.
4. A sibling project, **URL Shortener** (real, deployed, its own Claude Code cofounder), is known to exist — see `learner-profile.md`. Its 5 self-flagged bugs were reported fixed via that project's own cofounder, not verified from here.

**Highest real fixed port across the project: 4133** (`MongodbFundamentals/AggregationBasics`) — check this before assigning new ports on the next topic, per the fixed-port-collision gotcha in `build-conventions.md`.

## Momentum notes carried forward

1. Forcing a real container replacement in a test/demo: don't rely on `docker compose up --force-recreate` alone — force a genuine IP difference via a second container sharing the same `--network-alias` before removing the original (see `build-conventions.md`).
2. A service that fails by refusing/timing out a TCP connect doesn't have deterministic failure timing unless a connect timeout is explicitly configured — treat multiple plausible failure status codes as the same real bug.
3. Standing habits still in force from earlier sessions: proactive port-0/PID-scoping/matchAll-timeout discipline, `npm view` before writing any new dependency version, `@types/node` + `types: ["node"]` for TS examples referencing Node builtins, `error.stdout` for expected non-zero-exit CLI errors, disabling a spawned CLI tool's own internal multiprocess/fork option from the start.

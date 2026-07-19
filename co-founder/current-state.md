# Current State

Owned by `skillCoFounderMentor.md`. Live snapshot — always **overwrite** during `End Today`, never just append. First file read on every `@skillCoFounderMentor.md` activation.

- **Last session:** 2026-07-19, closed via `End Today`. User shared a system-design course syllabus and asked which parts genuinely need a hands-on build in this project; triaged it, added two new topics to the roadmap, and built both the same session — plus confirmed mastery on Logging & Error Tracking, which had been pending since 2026-07-18.

## What happened this session, in order

1. **Confirmed mastered: "Logging & Error Tracking"** (Stage E topic 2, built 2026-07-18) — user said "done" directly.
2. **Triaged a system-design syllabus against this project** (see `co-founder/roadmap.md`'s "2026-07-19 pass" entry for full reasoning) — judgment call on what's genuinely Node/Express-buildable vs. platform/infra-team territory better left conceptual. Added two real topics, folded a few smaller items into existing not-yet-built topics' descriptions (Redis distributed lock → Caching & Scaling; SSE → WebSockets & Real-Time; CAP theorem/sharding/consistent-hashing/latency-numbers → Backend System Design Drills), and decided a deliberate out-of-stage-number build order: finish the two new topics before returning to Stage E topic 3.
3. **Built and confirmed mastered: "Indexing & Search Performance"** (new Stage C topic 5) — `BTreeIndexQueryPlan` (100,000-row Postgres table, `EXPLAIN ANALYZE` measured before/after `CREATE INDEX`, real ~70-90x gap) and `PostgresFullTextSearch` (50,000-row table, before/after a real `GENERATED ... STORED` tsvector column + GIN index, real ~1600-5800x gap plus `ts_rank` ranking). Each its own dedicated Postgres schema. **Stage C is fully mastered again (5/5).**
4. **Built and confirmed mastered: "File Uploads & Blob Storage"** (new Stage D topic 5) — `PresignedS3Uploads`: real presigned-URL uploads against a real, self-hosted MinIO bucket (a genuinely new infra decision this session — see below). **Stage D is fully mastered again (5/5).**
5. **Real-world debugging loop on the S3 topic, driven by the user actually trying it themselves** — this is the most instructive part of the session, worth remembering the shape of: user tried the manual Postman upload → hit a real 403 → I reproduced it, found the actual root cause (a 60-second presigned-URL expiry, nowhere near enough for a real manual GUI flow), fixed it (900s/15min) → user then said the Postman instructions themselves were unusable ("too bad and not accurate") → fixed by building a proper scannable field-by-field visual block instead of a prose paragraph. Both fixes are now standing conventions in `build-conventions.md`.

## Real infrastructure

Stage A (5/5 mastered), Stage B (5/5 mastered), Stage C (5/5 mastered), Stage D (5/5 mastered), Stage E (2/5 built, both mastered). **24 topics fully mastered, 0 pending confirmation.**

Real infra in use across the project: a self-hosted PostgreSQL server (Coolify), a MongoDB Atlas cluster, and — new as of 2026-07-19 — a self-hosted MinIO (S3-compatible) bucket, also on the same Coolify instance. All three are real, shared servers with other real projects' data on them, each with its own established isolation convention (dedicated Postgres schemas, dedicated Mongo collections, dedicated S3 key prefixes — `node-express-learning/` for the S3 bucket, which already held a different real project's `products/` objects).

Highest fixed port assigned across the whole project: **4083** (`PresignedS3Uploads`).

## Next unbuilt

**Stage E topic 3, "Containerization & Deployment"** (Docker + a real host — Render/Railway/Fly/VPS still TBD). This is the last item in the build order decided this session — nothing else is queued ahead of it. Deployment target is still an open decision to make together when this topic is reached (per `CLAUDE.md`'s "still open" line).

## Standing conventions added this session (full detail in `build-conventions.md`)

- **Prisma auto-loads `.env`, the AWS SDK does not** — any `server.js` reading raw `process.env` values through a non-Prisma SDK needs its own explicit `import "dotenv/config"` at the top, not relying on `demo.js` loading it first.
- **A PostmanCheck step to a different real host needs its own visual block, not a `note` paragraph** — `PostmanCheck` can only represent requests to this app's own fixed `localhost` port; a manual step against a different host (e.g. a presigned S3 URL) needs a small dedicated component in the same visual language, not prose crammed into `note`.
- **A presigned URL (or similar time-limited pattern) meant for a human to complete manually through a GUI needs a generous expiry** — 60 seconds is only appropriate when the action happens programmatically, immediately, with no human steps in between. 15 minutes was the real fix here.
- **Job-control (`kill %1`) doesn't reliably work across separate Bash tool calls** — each call can be its own shell. Find and kill background test processes by real PID (`lsof -i :<port>`) instead.

## Open gaps / weak spots

- **REST Conventions, Auth Patterns, and CORS's `PostmanCheck`s predate two fixes** (exhaustive-steps rule, request/response separation) shipped 2026-07-18 — not yet retroactively applied. Flagged to the user before, not yet actioned either way. Worth raising again if it comes up naturally.
- No new gaps surfaced on this session's own fresh content beyond the two real, now-fixed bugs on the S3 topic (both already resolved and turned into standing rules above).

## Momentum notes carried forward

1. **The user tries things themselves and expects the mentor to actually debug real failures, not just describe the intended behavior** — confirmed sharply this session: a 403 in Postman got reproduced with real timing, root-caused, and fixed, rather than re-explained. When something the user tries doesn't work, the default move is to go verify it directly (spin up the real server, hit it the same way they did) before proposing a fix.
2. **Prose instructions that mix multiple real actions into one paragraph are not acceptable for anything meant to be followed step-by-step** — the user rejected a note field that buried a real "open a new request, do X, Y, Z" sequence inside dense text. Default to structured, scannable, field-by-field presentation (tables, labeled boxes) for anything actionable, especially multi-field Postman/API instructions.
3. **New real infra decisions (a new database, a new storage provider, a new external service) should be asked about directly, the same way the original Postgres/MongoDB decision was** — never silently fake or locally stand in for something the topic is genuinely about. This is now confirmed across three separate infra decisions (Postgres, MongoDB, S3/MinIO), all resolved the same way.
4. **Full port audits before assigning a new fixed port remain a standing habit** — `grep -rhoE "process\.env\.PORT \?\? [0-9]+" examples --include=server.js | grep -oE "[0-9]+" | sort -n`. No collisions this session because of it.
5. Everything from the 2026-07-17/18 "detail-rebuild pass" (plain-vocabulary prose, `ConceptBreakdown`/`Callout`, bespoke diagrams, per-statement comments, exhaustive PostmanChecks, cumulative routes/controllers layering, `demo.js`-calls-API-only) is now the permanent baseline for every new topic — both topics built this session applied it from the first draft with no correction needed on those fronts.

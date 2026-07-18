# Current State

Owned by `skillCoFounderMentor.md`. Live snapshot — always **overwrite** during `End Today`, never just append. First file read on every `@skillCoFounderMentor.md` activation.

- **Last session:** 2026-07-18, closed via `End Today`. Finished the entire "detail-rebuild pass" (started 2026-07-17) — rebuilt Stage D in full and Stage E topic 1, then built a genuinely new topic, Stage E topic 2.

## The detail-rebuild pass — COMPLETE

Every topic that existed at the start of the pass (21 total: Stage A–D plus Stage E topic 1) has now been rebuilt to the plain-vocabulary/`ConceptBreakdown`/`Callout`/bespoke-diagram/per-statement-comment standard. Full rules still live in `co-founder/build-conventions.md`'s "detail-rebuild pass" entry and its many follow-on entries — **keep reading that before touching any topic's example code**, since several of its standing rules (especially the layering rule below) apply to ALL future topics too, not just this pass.

**Final rebuild order this session:** REST Conventions & Validation → Authentication Patterns → CORS — the Frontend Handshake → OWASP API Security & Rate Limiting (Stage D now fully rebuilt) → Testing an Express App (Stage E topic 1, completing the pass). User confirmed mastery on Testing an Express App directly ("done," ran `npm test` themselves) — `curriculum.ts` updated to `"mastered"`.

## The big correction this session: layering is cumulative, not topic-scoped

Caught directly by the user on REST Conventions & Validation: three of its four mini-projects had route logic written straight inline in `server.js`, even though "Project Structure & Config" (a Stage B topic, built and mastered long before) exists specifically to teach the `routes/`/`controllers/` split. **Standing rule now, permanent:** once a structural convention is taught, every LATER topic's real Express example must keep using it, regardless of whether the new topic is "about" that convention. This got applied (self-correctly, without being asked again) across the rest of the session:
- Auth Patterns: all 3 mini-projects layered; `PasswordHashingBcrypt` upgraded from a bare bcrypt script into a real register/login API.
- CORS: both Playwright-driven mini-projects layered (routes/controllers work fine even with the `createApiServer(allowedOrigin)` factory pattern these need).
- Security & Rate Limiting: all 4 layered; `SqlInjectionBoundary` upgraded from a bare `node:sqlite` script into a real login API (with a `sqlExecuted` field returned ONLY for teaching, explicitly commented as never-do-this-in-production); `HelmetSecurityHeaders` given a second real fixed port so BOTH sides of its before/after comparison are genuinely Postman-testable.
- Testing an Express App: both Supertest mini-projects layered — `server.test.js` needed zero changes either time, since both still just `import { app }`. `UnitTestingPureFunctions` correctly stayed a bare module (no server) — that's a deliberate exemption, not a miss, since its whole point is contrasting unit vs. integration testing.
- Logging & Error Tracking (new topic, built after the rebuild pass): applied from the first draft, no correction needed.

**The sharper test to apply going forward:** "is this library/pattern something a real backend dev would ever call directly from a bare script, or does it always live behind a real endpoint?" bcrypt, jsonwebtoken, an ORM/ODM, and now `node:sqlite` are all in the same category — always behind a controller.

## PostmanCheck: two more real corrections, both now permanent

1. **Exhaustive, not representative.** Caught on Security & Rate Limiting: `PostmanCheck.steps` must list EVERY real request/response combination a section's routes actually support (every route × every meaningfully different input), not "a few to get the idea across." Applied retroactively to that topic (8+6+7+2 = 23 real combos, all curled and verified) and to Logging & Error Tracking from the start.
2. **Request-side vs. response-side separation.** The user caught instructional text (which header to send, "this is request 6 of 7") getting appended directly onto `expectBody` strings, making it look like part of the real response. Fixed by extending `PostmanStep` (`src/components/PostmanCheck.tsx`) with `headers`, `note` (request-side) and `expectHeaders` (response-side) — `expectBody`/`expectHeaders` must now be the literal real response and nothing else, ever.

**Not yet retroactively applied**: REST Conventions, Auth Patterns, and CORS's `PostmanCheck`s were built before both fixes above shipped — they're not exhaustive and may still have the old instructional-text-in-expectBody pattern. Flagged to the user at the end of the Security session; not yet actioned either way. Worth asking again next session if it hasn't come up.

## Stage E — now 2 of 5 built

- **Topic 1, "Testing an Express App"**: mastered (see above).
- **Topic 2, "Logging & Error Tracking"**: built fresh this session (NOT a rebuild — this is genuinely new content, first topic built from scratch since the pass started). Three real mini-projects: `StructuredLoggingWithPino` (manual structured logging, real info/warn levels), `RequestLoggingWithPinoHttp` (automatic per-request logging — found and fixed a real, confirmed gotcha: pino-http's own default never bumps the severity level for a real 500, stays at "info" until `customLogLevel` is configured), `CatchingUncaughtErrors` (a real process-level `uncaughtException`/`unhandledRejection` safety net, spawned as a real separate child process since the whole point is a real crash — verified the honest framing that Node crashes either way with or without the handler; the handler's real value is a structured log line instead of a raw stack dump, not crash prevention). Interview Angle includes a real, qualitative pino-vs-winston comparison. `status: "in-progress"` in `curriculum.ts` — **not yet confirmed mastered**, same "built and verified, but no direct review session yet" state Testing an Express App was in.
- **Next unbuilt**: Stage E topic 3, "Containerization & Deployment" (Docker + a real host — Render/Railway/Fly/VPS still TBD, per `CLAUDE.md`'s "still open" line).

**Next session should start with**: have the user review "Logging & Error Tracking" themselves (run `npm start`/`node demo.js` in one of the three mini-projects, or just read through the page), confirm mastery, flip `logging-observability` to `"mastered"` — same pattern as Testing an Express App. Only after that, either continue to Stage E topic 3, or decide whether to retroactively apply the two PostmanCheck fixes above to REST Conventions/Auth Patterns/CORS first (ask the user which they'd rather do).

## Real infrastructure

Stage A (5/5 mastered), Stage B (5/5 mastered), Stage C (4/4 mastered), Stage D (4/4 mastered, rebuilt), Stage E (2/5 built — 1 mastered, 1 pending confirmation). 21 topics fully mastered, 1 more built and pending confirmation.

## Open gaps / weak spots

None flagged by the user on any genuinely NEW content this session beyond the two PostmanCheck corrections and the layering correction, all already fixed and turned into standing rules. The three not-yet-retroactively-fixed `PostmanCheck`s (REST Conventions, Auth Patterns, CORS) are a known, named gap — see above, not yet actioned.

## Momentum notes carried forward

1. **The detail-rebuild pass is done.** Don't re-enter "rebuild mode" by default next session — the next default action is either a mastery-confirmation conversation (Logging & Error Tracking) or fresh topic building (Containerization & Deployment), not another pass over old topics, unless the user explicitly raises the REST Conventions/Auth Patterns/CORS PostmanCheck gap.
2. **Verification discipline caught every real gap again this session** — the pino/pino-http gotcha was found by actually installing and running it in a scratch directory BEFORE writing any prose claiming specific behavior, the same discipline that's caught every other library gotcha in this project. Keep defaulting to this, especially for brand-new topics where nothing has been verified yet.
3. **The user catches regressions immediately and expects the fix applied proactively across the rest of the same session, not just the one flagged instance** — confirmed again: once layering was caught on REST Conventions, it was applied without being re-asked on Auth Patterns, CORS, Security, and Testing; once PostmanCheck exhaustiveness was caught, the whole Security topic's guide was rewritten in one pass, not just the one example given.
4. **Full port audits are now a standing habit before assigning any new fixed port** — `grep -rhoE "process\.env\.PORT \?\? [0-9]+" examples --include=server.js | grep -oE "[0-9]+" | sort -n`. Caught 3 real collisions this session (REST Conventions' three servers had silently reused Stage C's ports; Testing an Express App's `TestingErrorCases` collided with Security's `BrokenAccessControl`) purely because topics were built out of chronological port-number order across different sessions. Current highest assigned port: 4080 (`CatchingUncaughtErrors`).
5. **A crash-observing demo needs a real separate child process, every time** — reconfirmed on `CatchingUncaughtErrors` (extends the same pattern from `ErrorHandlingExpress/LegacyTryCatch`). If a demo's whole point is a real `process.exit()`, it can never run in the same process as the thing capturing its output.
6. Real infrastructure/browser-enforcement/schema-isolation lessons from Stage C/D, and the various runner/execSync gotchas from Stage E topic 1, still stand — no new instances this session.

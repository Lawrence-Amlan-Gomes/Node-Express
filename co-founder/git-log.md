# Git Activity Log

Internal record kept by `skillGit.md`. One entry per push. Newest at the bottom.

Format: `- YYYY-MM-DD HH:MM — <short commit hash> — <one-line summary of what was committed>`

- 2026-07-13 — c4b50ae — Initial commit: repo initialized, remote added, full project scaffold pushed to origin main.
- 2026-07-14 — 39412f1 — Built seven Stage A/B topics (Core Modules, Modules/npm/package.json, TypeScript with Node, Express App Routing, Middleware Pipeline, Async Patterns on a Server, API Testing Tools) with per-section example mini-projects and live runners.
- 2026-07-15 10:32 — 62464d3 — Built Error Handling in Express, Project Structure & Config, and SQL vs NoSQL topics with per-section example mini-projects and live runners; renamed MiddlewarePipeline's HangsDemoRunner to NextCalledDemoRunner.
- 2026-07-16 12:13 — 4e174df — Built Auth Patterns, Connecting Real Databases, CORS/Frontend Handshake, Migrations & Schema Design, REST Conventions & Validation, Security & Rate Limiting, and Transactions & Performance topics with per-section example mini-projects and live runners.
- 2026-07-17 — 3817dcc — Detail-rebuild pass: every DB/resource example got a real server.js with routes/controllers so demo.js calls the API instead of importing Prisma/Mongoose directly, plus Postman verification guides; split CoreModules and AsyncPatternsOnServer into section-specific mini-projects; built the new Testing an Express App topic (Jest + Supertest); moved API Testing Tools to Stage B topic 1.
- 2026-07-18 — 8ea6c97 — Split every remaining mini-project's server.js into server.js/controllers/routes across Auth Patterns, CORS, REST Conventions, Security/Rate Limiting, and Testing an Express App; built the new Logging & Error Tracking topic (Pino structured logging, pino-http request logging, catching uncaught errors).
- 2026-07-19 — 3198361 — Built Indexing & Search Performance (real B-tree/EXPLAIN ANALYZE and tsvector/GIN full-text-search measurements on Postgres) and File Uploads & Blob Storage (real presigned-URL uploads against a newly-connected, self-hosted MinIO bucket) — both mastered same session; fixed a too-short presigned-URL expiry and rebuilt an unscannable Postman guide into a structured, copy-paste block.
- 2026-07-20 18:13 — 6955fea — Built Containerization & Deployment (real multi-stage vs single-stage Dockerfile size gap, Compose + Redis cache speed-up, and a live deploy to a real self-hosted Coolify server from its own dedicated repo); installed Docker Desktop as new local infra; added a ground-zero "what is a container" section after direct feedback the first draft assumed too much context. Not yet confirmed mastered.

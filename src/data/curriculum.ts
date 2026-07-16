// Single source of truth for the sidebar nav, the RoadMap page, and routing.
// status: 'not-started' | 'in-progress' | 'mastered'  (learner mastery, declared by the user, not auto-set)
// hasPage: true  -> routed to a dedicated file at src/app/topics/<slug>/page.tsx
// hasPage: false -> routed through src/app/topics/[slug]/page.tsx, which renders the stub placeholder
//
// This curriculum takes a frontend-verified React/Next.js developer and builds
// real Node.js + Express backend depth on top — job target: junior -> mid ->
// senior backend developer who can work credibly alongside a separate
// frontend team. See co-founder/roadmap.md for the prose version and reasoning.

export type TopicStatus = "not-started" | "in-progress" | "mastered";
export type AccentKey = "blue" | "purple" | "orange" | "yellow" | "green" | "cyan";

export interface Topic {
  slug: string;
  title: string;
  summary: string;
  hasPage: boolean;
  status: TopicStatus;
}

export interface Stage {
  id: string;
  label: string;
  color: AccentKey;
  topics: Topic[];
}

export const stages: Stage[] = [
  {
    id: "stage-a",
    label: "Stage A — Node.js & Backend Foundations",
    color: "blue",
    topics: [
      {
        slug: "what-is-nodejs",
        title: "What is Node.js, really",
        summary: "V8, libuv, the event loop, and why 'single-threaded but non-blocking' actually matters in production.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "modules-npm-packagejson",
        title: "Modules, npm & package.json",
        summary: "CommonJS vs ESM, semver, scripts, and dependency management.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "typescript-with-node",
        title: "TypeScript with Node.js",
        summary: "tsconfig for a backend (module: nodenext), running TS in dev (tsx / native type-stripping) vs compiling with tsc for prod, and a typed project layout — table-stakes for any 2026 backend role, not optional polish.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "core-modules",
        title: "Core Modules",
        summary: "fs, path, process, events, streams/buffers basics, and the Web-standard globals Node now ships natively (fetch, Headers, FormData, structuredClone) — a real bridge from browser-side fetch() you already know.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "async-patterns",
        title: "Async Patterns on a Server",
        summary: "Callbacks to promises to async/await, and why blocking the event loop is a real production bug.",
        hasPage: true,
        status: "mastered",
      },
    ],
  },
  {
    id: "stage-b",
    label: "Stage B — Express Fundamentals",
    color: "purple",
    topics: [
      {
        slug: "express-app-routing",
        title: "App & Router Basics (Express 5)",
        summary: "Creating an Express app, defining routes, and what next dev's equivalent (next start) is here: node server.js. Targets Express 5 — npm's default and the Technical Committee's production-recommended release as of 2026.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "middleware-pipeline",
        title: "The Middleware Pipeline",
        summary: "Why order matters — a top interview question — and how request/response flow through it.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "api-testing-tools",
        title: "API Testing Tools: curl, Postman & Thunder Client",
        summary: "Manually exploring and testing an API you're building — the terminal-based curl workflow used throughout this project so far, plus GUI tools (Postman, Thunder Client) and the plain-text .http file format they're both built around.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "error-handling-express",
        title: "Error Handling in Express",
        summary: "Express 5's automatic rejected-promise-to-error-middleware forwarding (the modern default), plus the manual try/catch pattern it replaces — real Express 4 codebases still need that legacy awareness.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "project-structure-config",
        title: "Project Structure & Config",
        summary: "Layering conventions, serving JSON/static assets, and environment config with dotenv.",
        hasPage: true,
        status: "mastered",
      },
    ],
  },
  {
    id: "stage-c",
    label: "Stage C — Data Layer",
    color: "orange",
    topics: [
      {
        slug: "sql-vs-nosql",
        title: "SQL vs NoSQL",
        summary: "Choosing a database model for a given problem — the real trade-offs between a relational store and a document store, and when each genuinely fits better.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "orm-query-builder",
        title: "Connecting Real Databases: PostgreSQL & MongoDB",
        summary: "Wiring up a real remote PostgreSQL database (Coolify) via Prisma AND a real remote MongoDB database (Atlas) via Mongoose — the same CRUD operations, built and compared side by side, both taught in real depth.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "migrations-schema-design",
        title: "Migrations & Schema Design",
        summary: "Versioned schema changes and relationship modeling in Postgres via Prisma Migrate, contrasted with schema design and embedding-vs-referencing decisions in MongoDB.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "transactions-performance",
        title: "Transactions & Query Performance",
        summary: "Transactions and N+1 query gotchas in both a relational store (Postgres joins) and a document store (MongoDB's own multi-document transactions and embedding-to-avoid-joins strategy).",
        hasPage: true,
        status: "mastered",
      },
    ],
  },
  {
    id: "stage-d",
    label: "Stage D — API Design & Real-World Concerns",
    color: "yellow",
    topics: [
      {
        slug: "rest-conventions-validation",
        title: "REST Conventions & Validation",
        summary: "Status codes, URL-path versioning, cursor vs offset pagination, idempotency keys (the pattern Stripe/PayPal use to make retries safe), and real input validation (zod/joi).",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "auth-patterns-express",
        title: "Authentication Patterns",
        summary: "Sessions vs JWT, and password hashing with bcrypt.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "cors-frontend-handshake",
        title: "CORS — the Frontend Handshake",
        summary: "The literal wire-level handshake with a frontend team's app — a real differentiator given an existing frontend background.",
        hasPage: true,
        status: "mastered",
      },
      {
        slug: "security-rate-limiting",
        title: "OWASP API Security & Rate Limiting",
        summary: "Broken access control/BOLA (the #1 real-world API vuln), injection at the API boundary, helmet for security misconfiguration, and rate limiting.",
        hasPage: true,
        status: "mastered",
      },
    ],
  },
  {
    id: "stage-e",
    label: "Stage E — Testing, Tooling & Production Readiness",
    color: "green",
    topics: [
      {
        slug: "testing-express",
        title: "Testing an Express App",
        summary: "Unit + integration testing with Jest/Vitest and Supertest.",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "logging-observability",
        title: "Logging & Error Tracking",
        summary: "Structured logging (pino/winston) and catching errors in production.",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "deployment-containers",
        title: "Containerization & Deployment",
        summary: "Docker basics and shipping to a real host (Render/Railway/Fly/VPS — TBD).",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "debugging-memory-profiling",
        title: "Debugging & Memory Profiling",
        summary: "Heap snapshots and comparison-based leak hunting (dangling event listeners, unbounded caches — the two classic culprits), --inspect, and when to reach for Clinic.js.",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "caching-scaling",
        title: "Caching & Scaling",
        summary: "Redis caching, the cluster module (process-based, fault-isolated, for I/O-bound HTTP load) vs worker_threads (shared-memory, for CPU-bound work) — a clean, real interview distinction — plus PM2 and load balancers.",
        hasPage: false,
        status: "not-started",
      },
    ],
  },
  {
    id: "stage-f",
    label: "Stage F — Advanced & Interview Prep",
    color: "cyan",
    topics: [
      {
        slug: "websockets-realtime",
        title: "WebSockets & Real-Time",
        summary: "Socket.io and real-time communication patterns.",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "background-jobs-queues",
        title: "Background Jobs & Message Queues",
        summary: "BullMQ + Redis — the de-facto standard for Node background job processing in 2026 — contrasted with RabbitMQ/Kafka for cross-service event streaming (a different problem, not just a bigger version of the same one).",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "microservices-vs-monolith",
        title: "Microservices vs Monolith",
        summary: "Tradeoffs, and when each actually makes sense.",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "beyond-rest-graphql-trpc",
        title: "Beyond REST: GraphQL & tRPC Awareness",
        summary: "When a team reaches for GraphQL (aggregating multiple resources for varied clients) or tRPC (end-to-end type safety with a TS frontend — directly relevant given the existing Next.js background) instead of plain REST. Awareness-level, not full depth.",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "backend-system-design",
        title: "Backend System Design Drills",
        summary: "Live-coding a REST API under time pressure, and system design interview practice — pagination, idempotency, and rate-limiting choices are real discussion anchors here.",
        hasPage: false,
        status: "not-started",
      },
      {
        slug: "working-with-frontend-teams",
        title: "Working With a Frontend Team",
        summary: "API contracts, OpenAPI/Swagger, and mocking a backend for a frontend dev — using the existing frontend background as a real interview differentiator.",
        hasPage: false,
        status: "not-started",
      },
    ],
  },
];

export function getAllTopics() {
  return stages.flatMap((stage) =>
    stage.topics.map((topic) => ({ ...topic, stageId: stage.id, stageLabel: stage.label, stageColor: stage.color }))
  );
}

export function getTopicBySlug(slug: string) {
  return getAllTopics().find((topic) => topic.slug === slug);
}

export const statusColorKey: Record<TopicStatus, AccentKey | "muted"> = {
  mastered: "green",
  "in-progress": "yellow",
  "not-started": "muted",
};

export const statusLabel: Record<TopicStatus, string> = {
  mastered: "Mastered",
  "in-progress": "In Progress",
  "not-started": "Not Started",
};

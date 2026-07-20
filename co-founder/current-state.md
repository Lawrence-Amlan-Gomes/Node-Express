# Current State

Owned by `skillCoFounderMentor.md`. Live snapshot — always **overwrite** during `End Today`, never just append. First file read on every `@skillCoFounderMentor.md` activation.

- **Last session:** 2026-07-20, closed via `End Today`. Built Stage E topic 3, "Containerization & Deployment," end to end — including two new real infra decisions (local Docker, a real deployment host) resolved live with the user, and a mid-build content rewrite after the user said the first draft didn't teach the material at the right starting level.

## What happened this session, in order

1. **Resolved two real infra decisions before building anything**, same pattern as every prior real-infra choice in this project: (a) local Docker — this machine had NO Docker at all (confirmed, matching the 2026-07-15 note); installed Docker Desktop via Homebrew cask, which took three rounds of cleanup (stale, broken `docker-credential-*`/`docker`/`kubectl`/`compose` symlinks left over from a January 2026 install that had been removed without cleanup) before it installed cleanly; (b) deployment target — user chose their own existing self-hosted **Coolify** instance (already running this project's Postgres + MinIO) over Render/Railway/Fly, specifically to reuse real infra already paid for.
2. **User's own idea, adopted as the real pattern:** rather than deploying a subdirectory of this whole mentor-app monorepo, the deployable mini-project (`DeployToCoolify`) also got pushed to its own brand-new, dedicated public GitHub repo (`github.com/Lawrence-Amlan-Gomes/docker-deploy-demo`) — kept completely separate from this project's own repo, the way a real deployable service actually lives in its own repo.
3. **Built and verified three real mini-projects**, each with its own real, measured result: `DockerfileBasics` (naive single-stage vs. real multi-stage Dockerfile, real measured image sizes — 383.6 MB vs 56.0 MB, 6.8x), `ComposeMultiContainer` (real Express + Redis via Docker Compose, service-name networking, real measured cache speed-up — ~940x on a deliberately slow naive-recursive Fibonacci), `DeployToCoolify` (the same real Dockerfile actually deployed to the real Coolify server, live-verified independently by curling the real assigned URL directly, not just trusting the user's report).
4. **Walked the user through the real Coolify dashboard live, screenshot by screenshot** — New Resource → Public Repository → Dockerfile build pack → real deploy → real build log → real live URL. This is the first topic in this project requiring hands-on navigation of a THIRD external tool's UI (after Postman's `PostmanMockUI` and the S3/MinIO console) — worth remembering the shape of if a future topic needs the same live-walkthrough treatment.
5. **A real, direct correction from the user after the topic was fully built and verified:** "I am not understanding anything... explain it like I am a baby." This is distinct from the earlier 2026-07-14 "beginner comments" correction — that one was about backend-mechanics topics where the user already has a JS/TS foothold; Docker/containers is a genuinely new DOMAIN with no such foothold. Saved as its own memory ([[feedback_new_domain_ground_zero]] in the cross-session memory system) since it's a distinct, generalizable calibration, not a one-off fix.
6. **Rewrote the page in response** — added a real, new first section ("Start Here: What Even IS a Container?") built entirely around the shipping-container analogy (the literal historical origin of the word), with its own new mini-project (`WhatIsAContainer`) whose whole job is the simplest possible real proof: ask this Mac its hostname, ask a real running container the same question, show the two genuinely different real answers. Also softened the language in every other section on the page to build on that same analogy ("the box," "messy kitchen vs. clean plate," "a hotel key card, not built into the walls") rather than leading with Docker vocabulary.
7. Full verification pass done twice (once after the initial build, once after the rewrite) — `tsc --noEmit`, `eslint`, a clean `rm -rf .next && npm run build`, and direct `curl` checks confirming real demo output renders in the page both times.

## Real infrastructure

Stage A (5/5 mastered), Stage B (5/5 mastered), Stage C (5/5 mastered), Stage D (5/5 mastered), Stage E (2/5 mastered, 1 more now built but **not yet confirmed mastered** — see below).

New real infra this session: **Docker Desktop**, now installed and running on this machine (was completely absent before today). **Coolify** (the user's existing self-hosted instance, already used for Postgres/MinIO) is now also this project's real deployment target — one real app (`docker-deploy-demo`) is live there, deployed from its own dedicated public GitHub repo, separate from this project's own repo.

Highest fixed port assigned across the whole project: **4092** (`DeployToCoolify`; `DockerfileBasics` = 4090, `ComposeMultiContainer` = 4091).

## Next unbuilt / in progress

**"Containerization & Deployment" itself is NOT yet confirmed mastered** — the user explicitly said "I will finish this topic in the next session" before ending today. `curriculum.ts` reflects this honestly: `hasPage: true`, `status: "in-progress"`, not `"mastered"`. **Next session should start by asking the user to actually read/try the rewritten page** (specifically the new "Start Here" section) and confirm whether the ground-zero rewrite actually landed, before either (a) marking it mastered, or (b) doing another pass if it still isn't clicking. Don't assume the rewrite fixed it just because it's real and verified — that's a content-quality judgment only the user can make.

After this topic is confirmed mastered, the next unbuilt item is **"Debugging & Memory Profiling"** (Stage E topic 4) per the roadmap's existing order.

## Open gaps / weak spots

- **The user needs Docker/containerization explained from a genuinely ground-zero starting point, more so than any backend-mechanics topic so far.** This isn't fully "closed" yet — the rewrite is built and verified, but not yet confirmed to have actually landed with the user (see above). Treat this as open until they say so.
- Carried forward, unresolved: REST Conventions, Auth Patterns, and CORS's `PostmanCheck`s still predate the exhaustive-steps/request-response-separation fixes from 2026-07-18. Still just flagged, not actioned.

## Momentum notes carried forward

1. **When a genuinely new DOMAIN is being taught (not just a new API on familiar ground), the existing "easy vocabulary" bar isn't automatically enough — start even earlier, with a real-world analogy, before any technical vocabulary at all.** See [[feedback_new_domain_ground_zero]]. This is now a standing calibration for any future topic that isn't a straightforward extension of JS/Express (e.g. if Stage F's message-queue or WebSocket topics ever feel similarly foreign, apply the same ground-zero-first treatment proactively rather than waiting to be told again).
2. **Real infra decisions keep getting asked directly, every time, rather than assumed or faked** — now confirmed across Postgres, MongoDB, S3/MinIO, local Docker, and a deployment host (Coolify). Keep this pattern going for anything Stage E/F still needs (Redis is already running locally via brew; nothing else obviously missing yet).
3. **The user's own idea (a dedicated separate repo for a deployable mini-project) was better than the original plan (deploying a subdirectory of this monorepo)** — worth remembering as a real, working pattern if any future topic also needs to deploy something for real.
4. Momentum notes from 2026-07-19 (real debugging loops driven by the user trying things themselves, structured non-prose instructions, full port audits before assigning new ones) all still stand and were applied cleanly again this session.

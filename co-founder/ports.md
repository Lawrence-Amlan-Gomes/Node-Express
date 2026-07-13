# Dev Server Port Tracking

Internal record so a new session knows what "my port" refers to, per the port-management rules in the root `CLAUDE.md`. Only the process/port recorded here as "mine" is safe for me to kill/restart on my own.

## Current state

- **Server running:** no — killed at `End Today`, 2026-07-13.
- **Last port used:** 3000 (`http://localhost:3000`)
- **Start command:** `npm run dev` (from project root — starts the Next.js viewer app via Turbopack)
- **Started by me this session:** n/a until next session starts it fresh.

## History

- 2026-07-13 — Project created, no server existed yet.
- 2026-07-13 — Built the Next.js viewer app shell (Dashboard/RoadMap/topic pages) + first real topic. Ran `npm install`, `npm run typecheck`, `npm run lint`, `npm run build` all clean, then started `npm run dev` on port 3000 (confirmed free beforehand). Verified live via `curl` — `/`, `/roadmap`, `/topics/what-is-nodejs`, and an unbuilt stub route all return 200.
- 2026-07-13 — Revised the `what-is-nodejs` topic content, then ran `rm -rf .next && npm run build` to verify the production build while the dev server (PID 38667) was still running — this corrupted its live cache (page started 500ing). Killed 38667 (mine, safe to kill) and restarted `npm run dev` clean on port 3000 (new PID 39346). Lesson: don't run `rm -rf .next`/`next build` against the same `.next` directory a live `npm run dev` is using — stop the dev server first, or use a separate check, next time.
- 2026-07-13 — `End Today`: killed PID 39346 (mine, started earlier this session) cleanly. Port 3000 confirmed clear before ending.

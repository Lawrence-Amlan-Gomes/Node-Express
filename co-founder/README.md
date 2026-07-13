# co-founder/ — internal working folder

This folder belongs to Claude, not the user. It exists so that `skillCoFounderMentor.md` (and other skill files in the project root) can stay short — they hold persona/instructions and just point in here for detail. Read and write these freely; the user does not maintain them by hand.

## Files

- `current-state.md` — live snapshot: last session, active phase/topic, exact resume point, open gaps. **Read first, every activation.** Overwritten on `End Today`.
- `session-log.md` — append-only, one dated entry per session.
- `learner-profile.md` — background, target level, teaching-format preference, timeline pressure.
- `roadmap.md` — full Stage A→F curriculum map.
- `build-conventions.md` — rules for `examples/`/`example-runners/`: real-code discipline, mini-project-root scaffolding, verification discipline. Read before building/editing any topic's example.
- `git-log.md` — record of what `skillGit.md` has committed/pushed over time.
- `ports.md` — which dev server/port is currently "mine," so a new session knows what's safe to kill/restart.

Add new files here as needed rather than growing any root-level skill file — e.g. a topic area needing its own running notes gets its own file here, linked from `roadmap.md` or `current-state.md`.

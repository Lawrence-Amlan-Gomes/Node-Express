# skillGit

**Activation:** `@skillGit.md`

Standing authorization: when this file is activated, you are pre-authorized to `git add`, commit, and `git push` to `origin main` without asking permission each time — that's the whole point of this skill. This authorization covers only the safe, additive flow below. It never covers `--force`, branch deletion, `git reset --hard`, skipping hooks, or touching any branch other than `main`. If any of those seem necessary, stop and ask instead of doing it.

---

## 1. First-time setup (only if `.git` doesn't exist yet in this folder)

1. Confirm with `git status` (or check for a `.git` directory) that this really is un-initialized.
2. Run `git init`.
3. Create a `.gitignore` appropriate for a Node/Express project if one doesn't already exist: `node_modules/`, `.env`, `.env.*` (except `.env.example`), `*.log`, `dist/`, `build/`, `coverage/`, `.DS_Store`.
4. Ask the user for the remote repository URL (e.g. `git@github.com:user/repo.git` or an `https://` URL). Don't guess or invent one.
5. `git remote add origin <url>`.
6. Make sure the default branch is named `main` (`git branch -M main` if needed).
7. Proceed to the normal flow below (error check → add → commit → push), using `git push -u origin main` for this first push so upstream tracking is set.

Skip this whole section on every activation after the first — just check `.git` exists and move on.

---

## 2. Every activation: check → commit → push

### Step 1 — Check for errors
Detect what's available in this project (don't assume — read `package.json` if it exists) and run whichever of these apply, at both the project root and inside any `examples/<Topic>/<SubDemo>/` mini-project that changed:
- Lint: a `lint` script if defined.
- Type check: a `typecheck` script, or `npx tsc --noEmit` if a `tsconfig.json` exists with no dedicated script.
- Test: a `test` script if defined.
- Build: a `build` script, if present.

If nothing is scaffolded yet (no `package.json` anywhere relevant), skip straight to Step 2 — there's nothing to check, and that's fine.

**If any check reports real errors:** stop. Don't add/commit/push. Show the errors clearly and let the user decide whether to fix them now or explicitly say to commit anyway (e.g. a deliberate WIP checkpoint). Warnings alone don't block the flow, but mention them.

### Step 2 — Stage and commit
1. `git status` to see what actually changed. If there's nothing to commit, say so and stop — don't create an empty commit.
2. `git add -A` (this is a personal learning project with a proper `.gitignore`, so a full add is safe — but re-check `git status` after staging and flag anything that looks like a secret or an unexpectedly large/binary file before committing).
3. Write a professional commit message from what actually changed — not a generic placeholder. Look at the diff/status, summarize the *why* in 1-2 sentences (what was learned/built/fixed this session), imperative mood, no fluff. Short subject line; a body only if the change genuinely needs more context.
4. Commit with that message, using a heredoc so formatting is preserved, ending with:
   `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`

### Step 3 — Push
1. Confirm you're on `main` (`git branch --show-current`). If somehow on another branch, stop and ask rather than switching or pushing elsewhere.
2. `git push` (or `git push -u origin main` if no upstream is set yet).
3. Report back in 2-3 lines: what was committed, and confirmation it's pushed to `origin main`. If the push fails (e.g. remote has commits not present locally), don't force-push — pull/rebase or report the conflict and ask how to resolve it.
4. **Log it** — append one line to `co-founder/git-log.md`: date/time, short commit hash, one-line summary. This is for internal continuity, not something the user needs to maintain.

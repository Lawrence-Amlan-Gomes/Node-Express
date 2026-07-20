# THE REAL, PRODUCTION-WORTHY DOCKERFILE — a multi-stage build.
# "Multi-stage" means this file has more than one FROM line. Each FROM
# starts a brand-new, throwaway build stage — only what you explicitly
# COPY --from=<stage> into the FINAL stage actually ships in the image
# everyone downloads and runs. Everything else (build tools, dev
# dependencies, npm's own cache) gets thrown away automatically.

# ---- Stage 1: "deps" — install real dependencies in a disposable stage ----
# node:22-alpine is a REAL, official Node.js image built on Alpine Linux,
# a tiny Linux distro (~5MB base) instead of a full Debian/Ubuntu base.
FROM node:22-alpine AS deps
WORKDIR /app
# Copy ONLY the two files npm actually needs to install real packages.
# Copying just these two files first (not the whole app) means Docker's
# layer cache can reuse this exact install step on every future build,
# as long as neither file changes — real, measurable build-speed win.
COPY package.json package-lock.json ./
# --omit=dev skips devDependencies (nodemon here) — those are real tools
# for local development, never needed to actually RUN the app.
RUN npm ci --omit=dev

# ---- Stage 2: "production" — the actual image that ships ----
FROM node:22-alpine AS production
WORKDIR /app
# Running as root inside a container is a real, avoidable security risk —
# create a real unprivileged system user/group instead of using root.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Pull ONLY the already-installed node_modules out of the "deps" stage —
# none of npm's build cache, no devDependencies, nothing else from stage 1.
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY routes ./routes
COPY controllers ./controllers
# Switch to the unprivileged user for every instruction from here on,
# including the real process CMD starts below.
USER appuser
ENV PORT=4090
# EXPOSE is documentation for humans/tooling — it does NOT actually
# publish the port. That only happens via "docker run -p" or Compose's
# "ports:" — proven directly in this section's own live demo below.
EXPOSE 4090
# The exec-array form (not a plain string) runs node directly as PID 1,
# so it receives OS signals (like a real "docker stop") correctly instead
# of them going to an intermediate shell process first.
CMD ["node", "server.js"]

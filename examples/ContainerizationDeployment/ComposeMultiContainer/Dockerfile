# Same real multi-stage pattern taught in the previous section — applied
# here too, not regressed back to a single-stage build just because THIS
# section's teaching point is Compose networking, not image size.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY routes ./routes
COPY controllers ./controllers
USER appuser
EXPOSE 4091
CMD ["node", "server.js"]

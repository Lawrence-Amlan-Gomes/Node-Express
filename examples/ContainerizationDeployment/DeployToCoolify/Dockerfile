# The exact same real Dockerfile that gets built and run locally in this
# demo ALSO gets built by Coolify on the real host — that's the entire
# point of shipping a container: "works on my machine" and "works in
# production" are now, for real, the same build.
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
ENV NODE_ENV=production
ENV PORT=4092
EXPOSE 4092
CMD ["node", "server.js"]

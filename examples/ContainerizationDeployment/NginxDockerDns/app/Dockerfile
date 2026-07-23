# Deliberately simple, single-stage — this section is about Nginx/DNS, not
# about image size (that's already taught in this same topic's earlier
# "Writing a Real Dockerfile" section).
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
EXPOSE 3000
CMD ["node", "server.js"]

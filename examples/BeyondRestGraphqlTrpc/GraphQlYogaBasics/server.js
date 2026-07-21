import { createYoga, createSchema } from "graphql-yoga";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";

const schema = createSchema({ typeDefs, resolvers });

// Yoga is itself a real request handler — Node's own http.createServer
// hands it every real request, the same shape as handing Express an app.
const yoga = createYoga({ schema });
const httpServer = createServer(yoga);

const PORT = process.env.PORT ?? 4116;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

export { httpServer };

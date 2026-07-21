import { USERS, ORDERS } from "./data.js";

export const resolvers = {
  Query: {
    order: (_parent, { id }) => ORDERS.find((o) => o.id === id) ?? null,
  },
  // GraphQL only actually calls this real resolver function if the real
  // client's query asked for "user" on an order at all — if a query never
  // mentions it, this never even runs.
  Order: {
    user: (order) => USERS.find((u) => u.id === order.userId) ?? null,
  },
};

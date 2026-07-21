// The real, published shape of everything a client is ALLOWED to ask
// for — User still has email and bio, exactly like the REST version. The
// difference isn't what data EXISTS, it's that a client gets to choose
// which of it actually comes back.
export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    bio: String!
  }

  type Order {
    id: ID!
    item: String!
    user: User!
  }

  type Query {
    order(id: ID!): Order
  }
`;

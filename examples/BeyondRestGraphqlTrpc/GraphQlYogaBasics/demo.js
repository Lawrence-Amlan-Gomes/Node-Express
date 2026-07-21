import { httpServer } from "./server.js";

await new Promise((resolve) => httpServer.listen(0, resolve));
const { port } = httpServer.address();

// The SAME real goal as the REST section: item + the buyer's name,
// nothing else — but asked for explicitly, in the query itself.
const query = `
  query {
    order(id: "1") {
      item
      user {
        name
      }
    }
  }
`;

console.log("Real goal: show \"item\" and the buyer's \"name\" — nothing more.\n");
console.log("ONE real request — POST /graphql:");

const response = await fetch(`http://localhost:${port}/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});
const { data } = await response.json();

console.log(`  ${JSON.stringify(data)}`);

console.log("\nReal total requests needed: 1 (no separate request for the user — GraphQL's real fix for under-fetching).");
console.log(`Real fields returned: ${JSON.stringify(Object.keys(data.order))} on the order, ${JSON.stringify(Object.keys(data.order.user))} on the user.`);
console.log("Real UNUSED fields sent over the wire: NONE — id/email/bio exist on the real schema, but nothing asked for them, so nothing came back.");

httpServer.close();

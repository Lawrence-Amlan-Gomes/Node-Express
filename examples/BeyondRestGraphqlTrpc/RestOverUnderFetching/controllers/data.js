// A real user record with fields a client asking for "just the order and
// the buyer's name" genuinely does not need — email and bio exist only
// to make over-fetching real and measurable, not hypothetical.
export const USERS = [
  { id: "1", name: "Lawrence", email: "lawrence@example.com", bio: "A long real bio nobody asked for in this screen." },
];

export const ORDERS = [{ id: "1", userId: "1", item: "Mechanical Keyboard" }];

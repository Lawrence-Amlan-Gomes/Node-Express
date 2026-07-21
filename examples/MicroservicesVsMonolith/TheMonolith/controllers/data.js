// Both "users" and "orders" live in the SAME plain in-memory store, inside
// the SAME real process — the defining trait of a monolith. There's no
// real boundary between these two concerns at all.
export const USERS = [{ id: "1", name: "Lawrence" }];
export const ORDERS = [{ id: "1", userId: "1", item: "Mechanical Keyboard" }];

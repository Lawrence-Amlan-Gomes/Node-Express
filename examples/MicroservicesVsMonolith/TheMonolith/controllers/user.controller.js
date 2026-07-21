import { USERS } from "./data.js";

// A plain, exported JS function — this is what "looking up a user" means
// inside a monolith. Anything else in this SAME process can just call it
// directly, in memory, with zero network involved at all.
export function findUserById(id) {
  return USERS.find((u) => u.id === id);
}

export function getUser(req, res) {
  const user = findUserById(req.params.id);
  if (!user) {
    res.status(404).json({ error: "No user with that id" });
    return;
  }
  res.json(user);
}

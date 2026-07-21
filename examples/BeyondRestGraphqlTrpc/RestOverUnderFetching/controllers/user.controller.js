import { USERS } from "./data.js";

// A real, ordinary REST endpoint — it always returns the WHOLE user
// object. It has no way to know a particular caller only wanted the name.
export function getUser(req, res) {
  const user = USERS.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: "No user with that id" });
    return;
  }
  res.json(user);
}

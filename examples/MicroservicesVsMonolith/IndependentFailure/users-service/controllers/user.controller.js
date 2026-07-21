const USERS = [{ id: "1", name: "Lawrence" }];

export function getUser(req, res) {
  const user = USERS.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: "No user with that id" });
    return;
  }
  res.json(user);
}

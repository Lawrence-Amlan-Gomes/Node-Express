// A plain, ordinary REST handler — proves the SAME real server can still
// answer normal HTTP requests on the SAME real port the WebSocket below
// shares with it.
export function getStatus(req, res) {
  res.json({ message: "This is a normal HTTP response, from the same real server the WebSocket runs on." });
}

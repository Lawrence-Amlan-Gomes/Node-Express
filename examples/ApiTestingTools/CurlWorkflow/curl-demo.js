// curl is the terminal-based way to send a real HTTP request — no GUI, no
// extension, just a command. It's genuinely the same operation Postman and
// Thunder Client do under the hood; this script proves that by starting the
// REAL server.js as its own process (curl needs an actual separate server
// to talk to, the same way it would for you running this by hand) and then
// running real curl commands against it.
import { spawn, execSync } from "node:child_process";

// Spawn the real server as a genuinely separate OS process — exactly like
// running "node server.js" yourself in another terminal tab.
const server = spawn("node", ["server.js"], { cwd: import.meta.dirname });

// Wait for the real "Listening on..." line before sending any requests —
// otherwise we'd race the server's own startup.
await new Promise((resolve) => {
  server.stdout.on("data", (chunk) => {
    if (chunk.toString().includes("Listening")) resolve();
  });
});

// A small helper so each curl call below is one readable line instead of
// repeating execSync + console.log four separate times.
function runCurl(label, command) {
  // execSync actually runs the real curl binary and captures its real output.
  const output = execSync(command, { encoding: "utf-8" });
  console.log(`${label}\n  $ ${command}\n  ${output.trim()}`);
}

// -s = silent (hide curl's own progress bar, show only the real response).
runCurl("1) GET all todos", "curl -s http://localhost:4010/todos");
runCurl("2) GET one todo by id", "curl -s http://localhost:4010/todos/2");
// -X POST changes the method; -H sets a header; -d sends a real request body.
runCurl(
  "3) POST a new todo, with a real JSON body",
  `curl -s -X POST -H "Content-Type: application/json" -d '{"text":"Try sending this request for real"}' http://localhost:4010/todos`
);
// -w appends the real HTTP status code after the body, so it's visible too.
runCurl("4) GET something that doesn't exist (real 404)", "curl -s -w \"\\n(HTTP %{http_code})\" http://localhost:4010/todos/999");

// Stop the real spawned server process now that every request is done.
server.kill();

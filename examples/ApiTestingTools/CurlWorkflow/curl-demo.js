// curl is the terminal-based way to send a real HTTP request — no GUI, no
// extension, just a command. It's genuinely the same operation Postman and
// Thunder Client do under the hood; this script proves that by starting the
// REAL server.js as its own process (curl needs an actual separate server
// to talk to, the same way it would for you running this by hand) and then
// running real curl commands against it.
import { spawn, execSync } from "node:child_process";

const server = spawn("node", ["server.js"], { cwd: import.meta.dirname });

// Wait for the real "Listening on..." line before sending any requests —
// otherwise we'd race the server's own startup.
await new Promise((resolve) => {
  server.stdout.on("data", (chunk) => {
    if (chunk.toString().includes("Listening")) resolve();
  });
});

function runCurl(label, command) {
  const output = execSync(command, { encoding: "utf-8" });
  console.log(`${label}\n  $ ${command}\n  ${output.trim()}`);
}

runCurl("1) GET all todos", "curl -s http://localhost:4010/todos");
runCurl("2) GET one todo by id", "curl -s http://localhost:4010/todos/2");
runCurl(
  "3) POST a new todo, with a real JSON body",
  `curl -s -X POST -H "Content-Type: application/json" -d '{"text":"Try sending this request for real"}' http://localhost:4010/todos`
);
runCurl("4) GET something that doesn't exist (real 404)", "curl -s -w \"\\n(HTTP %{http_code})\" http://localhost:4010/todos/999");

server.kill();

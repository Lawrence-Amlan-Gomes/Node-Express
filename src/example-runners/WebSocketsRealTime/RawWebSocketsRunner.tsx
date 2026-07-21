import { execSync } from "node:child_process";

export default async function RawWebSocketsRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/WebSocketsRealTime/RawWebSockets",
  });

  return <>{output}</>;
}

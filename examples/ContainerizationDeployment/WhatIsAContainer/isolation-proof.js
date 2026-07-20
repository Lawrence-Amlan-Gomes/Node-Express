// The simplest real proof there is: ask THIS Mac who it is, then ask a
// real Docker container the exact same question, and see two completely
// different, real answers — proving the container isn't just "running
// some code," it's a genuinely separate little computer of its own.
import os from "node:os";
import { execSync } from "node:child_process";

function run(command) {
  return execSync(command, { encoding: "utf-8" }).trim();
}

// This Mac's own real hostname and real operating system — no container
// involved at all yet.
const realMacHostname = os.hostname();
const realMacPlatform = os.platform();

// "alpine" is a real, tiny, official Linux image — Docker downloads it
// once (a few MB) and reuses it after that. Running "hostname" INSIDE a
// real container asks the SAME question, but from inside that separate
// box.
const containerHostname = run("docker run --rm alpine hostname");

// /etc/os-release is a real file every Linux system has, describing
// exactly which OS it's running. This Mac doesn't even have this file —
// proving what's inside the container is a genuinely different, real OS.
const containerOsRelease = run("docker run --rm alpine cat /etc/os-release");

console.log("This real Mac's own hostname:");
console.log(`  ${realMacHostname}`);
console.log(`This real Mac's own platform:`);
console.log(`  ${realMacPlatform}`);

console.log("\nA real Docker container's hostname (same question, asked INSIDE the container):");
console.log(`  ${containerHostname}`);

console.log("\nThat same container's real operating system (this Mac doesn't even have this file):");
console.log(containerOsRelease);

console.log(
  `\nSame laptop, two completely different real answers — "${realMacHostname}" outside, "${containerHostname}" inside. That's not a trick: the container is a real, separate, sealed environment.`
);

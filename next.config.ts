import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Several topic pages' runners do real, slow work at build time (spawning
  // real child processes, hitting real remote Postgres/MongoDB servers) —
  // the default 60s budget isn't enough once several such pages happen to
  // build concurrently on this machine. Raised, not removed — a page that's
  // still this slow after the bump is a real problem worth investigating,
  // not something to paper over with an unbounded timeout.
  staticPageGenerationTimeout: 180,
};

export default nextConfig;

import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import BrokenAccessControlRunner from "@/example-runners/SecurityRateLimiting/BrokenAccessControlRunner";
import SqlInjectionBoundaryRunner from "@/example-runners/SecurityRateLimiting/SqlInjectionBoundaryRunner";
import RateLimitingRunner from "@/example-runners/SecurityRateLimiting/RateLimitingRunner";
import HelmetSecurityHeadersRunner from "@/example-runners/SecurityRateLimiting/HelmetSecurityHeadersRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function BolaDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-yellow-500 mb-2.5">OWASP&apos;s real #1 weak spot in APIs. Found in about 88% of checked Node APIs:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">Logged in? YES. This really is a real user with a real identity.</div>
      <div className="pl-2 mb-1.5 text-green-500">Allowed to touch THIS thing? Never checked. So any logged-in user can read ANY other user&apos;s thing, just by changing an id.</div>
      <div className="mt-2 text-muted">
        The bug is not a missing login check. It&apos;s a missing ownership check, done AFTER logging in.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Broken Access Control (BOLA)",
    paragraphs: [
      "BOLA stands for Broken Object Level Authorization. It is the #1 most common weak spot in real APIs, found in about 88% of checked Node apps. Here is why it's sneaky. Logging in still works fine — a real user gets in with no problem. The missing piece is a SECOND check: does this user really own the exact thing they're asking for? Just being logged in is not enough.",
      "The demo below shows the real problem. User 1 logs in, then asks for user 2's order — just by changing the id number in the URL. The broken route hands it right over. That's a real data leak. The fixed route does the same lookup, but adds one more check: does this order belong to you? Now user 1 gets told no (403). User 2 can still see their own order just fine.",
    ],
    extra: <BolaDiagram />,
    demo: <BrokenAccessControlRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/BrokenAccessControl/server.js", note: "Two real routes side by side — one missing the object-level ownership check, one with it." },
      { path: "examples/SecurityRateLimiting/BrokenAccessControl/demo.js", note: "Proves the real data leak on the vulnerable route and the real 403 on the fixed one." },
    ],
  },
  {
    heading: "SQL Injection at the API Boundary",
    paragraphs: [
      "A web app often builds a question for the database by joining pieces of text together. One of those pieces comes straight from what the user typed. That's the real danger — if someone types something tricky, they can change what the question actually means.",
      "This demo uses node:sqlite, a real database tool built right into Node (nothing extra to install). It shows a real attack: someone types ada' -- as their username. That's not a real name — it changes the question itself. It skips the password check completely, and logs the attacker in as ada, with no real password at all.",
      "There's a simple fix: keep the user's typed text separate from the question, never joined together as one piece of text. We try the exact same attack again, and this time it fails. The database keeps the typed text as just plain data, no matter what it says — so there's no user really named \"ada' --\" to find.",
    ],
    demo: <SqlInjectionBoundaryRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/SqlInjectionBoundary/demo.js", note: "A real string-concatenated query bypassed by a real injection payload, and the real parameterized fix that rejects it." },
    ],
  },
  {
    heading: "Rate Limiting",
    paragraphs: [
      "Without a real limit, one client can send requests as fast as the network allows. Maybe it's a bug causing endless retries. Maybe it's someone trying to guess a password over and over. express-rate-limit adds a real limit, in just a few lines of code.",
      "The demo below sends 7 real requests, one after another, to a rule that only allows 5 every 60 seconds. The first 5 go through fine, and a real RateLimit-Remaining header counts down to 0 as they go. The 6th and 7th get a real 429 reply — \"too many requests.\" We also found something real worth knowing: by default, express-rate-limit sends back plain text, not JSON. This example changes that to real JSON, since that's what a real API should send.",
    ],
    demo: <RateLimitingRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/RateLimiting/server.js", note: "A real express-rate-limit configuration — 5 requests per 60-second window." },
      { path: "examples/SecurityRateLimiting/RateLimiting/demo.js", note: "Fires 7 real requests and shows the real 200→429 transition with real headers." },
    ],
  },
  {
    heading: "Helmet for Security Misconfiguration",
    paragraphs: [
      "OWASP has a real category called \"Security Misconfiguration,\" and this is a perfect example of it. By default, an Express app's reply headers quietly give away information — one header, X-Powered-By: Express, tells an attacker exactly what framework you're using, a free hint. The default also leaves off several real, well-known browser protections. helmet turns all of that on, in just one line of code.",
      "The demo below runs two real Express apps side by side and prints the ACTUAL headers each one sends back. Without helmet: X-Powered-By is there, and nothing else is. With helmet(): X-Powered-By is gone, and a few real protective headers show up instead, like Content-Security-Policy and X-Frame-Options.",
    ],
    demo: <HelmetSecurityHeadersRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/HelmetSecurityHeaders/server.js", note: "Two real Express apps — one plain, one with helmet() — for a direct real header comparison." },
      { path: "examples/SecurityRateLimiting/HelmetSecurityHeaders/demo.js", note: "Fetches both real apps and prints the actual header differences." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. BOLA is the most common real weak spot in APIs — about 88% of checked Node APIs have it. The fix is not a better login check. It's one more check, done after login: does this user actually own this thing? SQL injection happens while a query is being put together, not inside any one specific database. Joining text together is the bug. Keeping user input separate is the fix. Rate limiting puts a real, countable limit on how many requests one client can send, and sends back a real 429 once that limit is passed. helmet turns on a whole set of real, protective headers that most teams forget to set themselves.",
    ],
    extra: (
      <>
        <FlowChain steps={["a request comes in", "logged in? → check", "allowed to touch THIS thing? → check separately (BOLA)", "input going into a query? → keep it separate, never join it", "too many requests from this client? → real 429", "response headers → helmet's real protective set"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "BOLA is OWASP's #1 real weak spot in APIs — logging in successfully is not the same as being allowed to touch one specific thing. The fix is a real, per-item ownership check.",
            "SQL injection is a bug in how you build a query, not a flaw in one specific database. Keeping user input separate (or using a tool like Prisma, which always does this for you) fixes it for good.",
            "Rate limiting is a real, countable defense — a real limit on requests, real 429 replies — against both accidents (retry loops) and attacks (password guessing).",
            "helmet doesn't replace real decisions about HTTPS or content security — it just turns on sane, real defaults for headers most teams forget to set, closing an easy gap cheaply.",
          ]}
        />
      </>
    ),
  },
];

export default function SecurityRateLimitingPage() {
  return (
    <StudyPage
      title="OWASP API Security & Rate Limiting"
      stageLabel="Stage D — API Design & Real-World Concerns"
      stageColor="yellow"
      intro="Four real, separate ideas about API security, straight from OWASP's own list. Each one is proven with a real attack or a real before-and-after: a real BOLA data leak and its fix, a real SQL injection login trick, a real 429 after hitting a real limit, and the real header difference helmet actually makes."
      sections={sections}
    />
  );
}

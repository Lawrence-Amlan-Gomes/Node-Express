import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import BrokenAccessControlRunner from "@/example-runners/SecurityRateLimiting/BrokenAccessControlRunner";
import SqlInjectionBoundaryRunner from "@/example-runners/SecurityRateLimiting/SqlInjectionBoundaryRunner";
import RateLimitingRunner from "@/example-runners/SecurityRateLimiting/RateLimitingRunner";
import HelmetSecurityHeadersRunner from "@/example-runners/SecurityRateLimiting/HelmetSecurityHeadersRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-18.

function BolaStepDiagram() {
  const steps: { label: string; caption: string; tone: "green" | "red" | "orange" }[] = [
    { label: "User 1 → GET /orders-vulnerable/101 (their OWN order)", caption: "Works correctly — 200. Nothing wrong yet.", tone: "green" },
    { label: "User 1 → GET /orders-vulnerable/102 (USER 2's order)", caption: "Still 200 — a real data leak. The route only checked WHO you are, never WHAT you're allowed to touch.", tone: "red" },
    { label: "User 1 → GET /orders-fixed/102 (USER 2's order)", caption: "403 this time — the exact same lookup, plus one real ownership check.", tone: "orange" },
    { label: "User 2 → GET /orders-fixed/102 (their OWN order)", caption: "200 — the fix never blocks a genuine owner, only everyone else.", tone: "green" },
  ];
  const toneClasses: Record<string, string> = {
    green: "border-green-500 bg-green-500/3 text-green-500",
    red: "border-red-500 bg-red-500/3 text-red-500",
    orange: "border-orange-500 bg-orange-500/3 text-orange-500",
  };
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">OWASP&apos;s real #1 weak spot in APIs, found in about 88% of checked Node APIs — checked directly against the running server</div>
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div key={step.label} className={`rounded-card border px-3 py-2 ${toneClasses[step.tone]}`}>
            <div className="font-mono text-xs font-semibold">{step.label}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{step.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">The bug is never a missing login check — the request really is authenticated. It&apos;s a missing OWNERSHIP check, done AFTER logging in.</span>
      </div>
    </div>
  );
}

function SqlInjectionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-sublabel mb-2.5 uppercase tracking-wide text-[11px]">The real SQL that actually ran, for the SAME malicious username — checked directly</div>
      <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2 mb-2">
        <div className="text-red-500 font-semibold mb-1">VULNERABLE — string concatenation</div>
        <div className="text-body break-all">SELECT * FROM users WHERE username = &apos;ada&apos; --&apos; AND password = &apos;anything&apos;</div>
        <div className="text-sublabel mt-1">The real `&apos; --` in the input closes the quote early and comments out the password check — LOGGED IN AS ada, with no real password at all.</div>
      </div>
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2">
        <div className="text-green-500 font-semibold mb-1">FIXED — parameterized query</div>
        <div className="text-body break-all">SELECT * FROM users WHERE username = ? AND password = ?</div>
        <div className="text-sublabel mt-1">The SAME malicious text is bound as a real, separate parameter — the database treats it as pure data. Rejected: no user is literally named &quot;ada&apos; --&quot;.</div>
      </div>
    </div>
  );
}

function RateLimitDiagram() {
  const requests = [
    { n: 1, remaining: 4, status: 200 },
    { n: 2, remaining: 3, status: 200 },
    { n: 3, remaining: 2, status: 200 },
    { n: 4, remaining: 1, status: 200 },
    { n: 5, remaining: 0, status: 200 },
    { n: 6, remaining: 0, status: 429 },
    { n: 7, remaining: 0, status: 429 },
  ];
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">7 real requests, same client, same route — a real limit of 5 per 60-second window</div>
      <div className="flex flex-wrap gap-2">
        {requests.map((r) => (
          <div
            key={r.n}
            className={`rounded-card border px-3 py-2 text-center min-w-20 ${r.status === 200 ? "border-green-500 bg-green-500/3 text-green-500" : "border-red-500 bg-red-500/3 text-red-500"}`}
          >
            <div className="font-mono text-xs font-bold">#{r.n}</div>
            <div className="font-mono text-[11px] mt-1">{r.status}</div>
            <div className="text-sublabel text-[10px] mt-1">left: {r.remaining}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-orange-500 bg-orange-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-orange-500 text-xs">RateLimit-Remaining counts down with every real request — the moment it hits 0, the NEXT request gets a real 429 instead of running the route at all.</span>
      </div>
    </div>
  );
}

function HeaderComparisonDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The SAME route, on two real apps — the only difference is one line of middleware</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">WITHOUT helmet()</div>
          <div className="text-body text-xs leading-relaxed font-mono">X-Powered-By: Express</div>
          <div className="text-sublabel text-xs leading-relaxed mt-1">A real, free hint to an attacker about which framework-specific vulnerabilities might apply. Every other protective header: not set.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">WITH helmet()</div>
          <div className="text-body text-xs leading-relaxed font-mono">X-Powered-By: (gone)</div>
          <div className="text-sublabel text-xs leading-relaxed mt-1">Plus real, active protections: Content-Security-Policy, X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, and more.</div>
        </div>
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-cyan-500 text-xs">Neither app&apos;s route logic changed at all — both share the exact same controller. Only the middleware wired into server.js is different.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Broken Access Control (BOLA)",
    body: (
      <>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "BOLA — Broken Object Level Authorization",
              description: "OWASP's #1 most common real weak spot in APIs, found in about 88% of checked Node apps.",
            },
            {
              label: "Logging In Still Works Fine — That's the Sneaky Part",
              description: "A real user gets in with no problem. The missing piece is a SECOND check: does this user really own the exact thing they're asking for? Just being logged in is not enough.",
            },
            {
              label: "Same Real Layering as Every Other Topic",
              description: "server.js wires the app together, routes/orders.routes.js declares the two endpoints, and controllers/orders.controller.js is the ONLY file that decides who's allowed to see what.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="yellow">
          The bug is never a missing login check — the request really is authenticated. It&apos;s a missing
          OWNERSHIP check, done AFTER logging in, for the SPECIFIC object being requested.
        </Callout>
        <p>
          The demo below shows the real problem. User 1 logs in, then asks for user 2&apos;s order — just by changing
          the id number in the URL. The broken route hands it right over. That&apos;s a real data leak. The fixed
          route does the same lookup, but adds one more check: does this order belong to you? Now user 1 gets told
          no (403). User 2 can still see their own order just fine.
        </p>
      </>
    ),
    extra: <BolaStepDiagram />,
    demo: <BrokenAccessControlRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/BrokenAccessControl/routes/orders.routes.js", note: "Declares which path/method maps to which controller function — no ownership logic here at all." },
      { path: "examples/SecurityRateLimiting/BrokenAccessControl/controllers/orders.controller.js", note: "The ONLY file with the real ownership check — the vulnerable and fixed versions side by side." },
      { path: "examples/SecurityRateLimiting/BrokenAccessControl/demo.js", note: "Proves the real data leak on the vulnerable route and the real 403 on the fixed one." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/SecurityRateLimiting/BrokenAccessControl"
        runCommand="node server.js"
        runPort={4061}
        steps={[
          { method: "GET", path: "/orders-vulnerable/101", note: "Send with NO X-User-Id header at all.", expectStatus: 401, expectBody: '{"error":"X-User-Id header required"}' },
          { method: "GET", path: "/orders-vulnerable/101", headers: { "X-User-Id": "1" }, note: "This really is user 1's own order.", expectStatus: 200, expectBody: '{"id":101,"userId":1,"item":"Laptop","total":1200}' },
          { method: "GET", path: "/orders-vulnerable/102", headers: { "X-User-Id": "1" }, note: "A real data leak: this is USER 2's order.", expectStatus: 200, expectBody: '{"id":102,"userId":2,"item":"Headphones","total":150}' },
          { method: "GET", path: "/orders-vulnerable/999", headers: { "X-User-Id": "1" }, note: "No order with this id exists at all.", expectStatus: 404, expectBody: '{"error":"order not found"}' },
          { method: "GET", path: "/orders-fixed/101", headers: { "X-User-Id": "1" }, note: "Still allowed: this is really user 1's own order.", expectStatus: 200, expectBody: '{"id":101,"userId":1,"item":"Laptop","total":1200}' },
          { method: "GET", path: "/orders-fixed/102", headers: { "X-User-Id": "1" }, note: "The fix blocks access to USER 2's order.", expectStatus: 403, expectBody: '{"error":"you do not have access to this order"}' },
          { method: "GET", path: "/orders-fixed/102", headers: { "X-User-Id": "2" }, note: "Allowed: this really is user 2's own order.", expectStatus: 200, expectBody: '{"id":102,"userId":2,"item":"Headphones","total":150}' },
          { method: "GET", path: "/orders-fixed/999", headers: { "X-User-Id": "1" }, note: "No order with this id exists at all.", expectStatus: 404, expectBody: '{"error":"order not found"}' },
        ]}
      />
    ),
  },
  {
    heading: "SQL Injection at the API Boundary",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "Building a Query by Joining Text Together Is the Bug",
              description: "A web app often builds a question for the database by joining pieces of text together — and one of those pieces comes straight from what the user typed. If someone types something tricky, they can change what the question actually means.",
            },
            {
              label: "The Fix: Keep User Input Separate, Never Joined",
              description: "A parameter placeholder (?) tells the database engine \"this is pure data, never SQL syntax\" — no matter what characters it contains.",
              example: "SELECT * FROM users WHERE username = ? AND password = ? — bound separately, never concatenated.",
            },
            {
              label: "This Is a Real Login API, Not a Bare Script",
              description: "controllers/auth.controller.js is the ONLY file that touches node:sqlite — server.js and routes/auth.routes.js never see a query string at all.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          SQL injection happens while a query is being BUILT, not inside any one specific database engine — string
          concatenation is the bug, and keeping user input separate is the fix, on any database.
        </Callout>
        <p>
          This demo uses node:sqlite, a real database tool built right into Node (nothing extra to install). It
          shows a real attack: someone sends ada&apos; -- as their username. That&apos;s not a real name — it changes
          the question itself, skipping the password check completely and logging the attacker in as ada, with no
          real password at all. The exact same attack against the fixed route fails — the database keeps the typed
          text as just plain data, no matter what it says.
        </p>
      </>
    ),
    extra: <SqlInjectionDiagram />,
    demo: <SqlInjectionBoundaryRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/SqlInjectionBoundary/routes/auth.routes.js", note: "Declares which path/method maps to which controller function — no SQL here at all." },
      { path: "examples/SecurityRateLimiting/SqlInjectionBoundary/controllers/auth.controller.js", note: "The ONLY file that touches node:sqlite — the vulnerable, concatenated query and the fixed, parameterized one, side by side." },
      { path: "examples/SecurityRateLimiting/SqlInjectionBoundary/demo.js", note: "Calls the real, running API over real HTTP — proves the real attack succeeding, then failing against the fix." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/SecurityRateLimiting/SqlInjectionBoundary"
        runCommand="node server.js"
        runPort={4075}
        steps={[
          {
            method: "POST",
            path: "/login-vulnerable",
            body: JSON.stringify({ username: "ada", password: "real-secret-password" }, null, 2),
            note: "A real, correct login.",
            expectStatus: 200,
            expectBody: '{"sqlExecuted":"SELECT * FROM users WHERE username = \'ada\' AND password = \'real-secret-password\'","loggedIn":true,"username":"ada"}',
          },
          {
            method: "POST",
            path: "/login-vulnerable",
            body: JSON.stringify({ username: "ada", password: "wrong" }, null, 2),
            note: "A real, genuinely wrong password.",
            expectStatus: 401,
            expectBody: '{"sqlExecuted":"SELECT * FROM users WHERE username = \'ada\' AND password = \'wrong\'","loggedIn":false,"username":null}',
          },
          {
            method: "POST",
            path: "/login-vulnerable",
            body: JSON.stringify({ username: "ada' --", password: "anything" }, null, 2),
            note: "The real attack — no real password needed.",
            expectStatus: 200,
            expectBody: '{"sqlExecuted":"SELECT * FROM users WHERE username = \'ada\' --\' AND password = \'anything\'","loggedIn":true,"username":"ada"}',
          },
          {
            method: "POST",
            path: "/login-fixed",
            body: JSON.stringify({ username: "ada", password: "real-secret-password" }, null, 2),
            note: "A legitimate login still works fine on the fixed route.",
            expectStatus: 200,
            expectBody: '{"sqlExecuted":"SELECT * FROM users WHERE username = ? AND password = ?  -- with username/password bound as real parameters, not concatenated","loggedIn":true,"username":"ada"}',
          },
          {
            method: "POST",
            path: "/login-fixed",
            body: JSON.stringify({ username: "ada", password: "wrong" }, null, 2),
            note: "A real, genuinely wrong password, rejected normally.",
            expectStatus: 401,
            expectBody: '{"sqlExecuted":"SELECT * FROM users WHERE username = ? AND password = ?  -- with username/password bound as real parameters, not concatenated","loggedIn":false,"username":null}',
          },
          {
            method: "POST",
            path: "/login-fixed",
            body: JSON.stringify({ username: "ada' --", password: "anything" }, null, 2),
            note: "The exact same attack — defeated. No user is literally named \"ada' --\".",
            expectStatus: 401,
            expectBody: '{"sqlExecuted":"SELECT * FROM users WHERE username = ? AND password = ?  -- with username/password bound as real parameters, not concatenated","loggedIn":false,"username":null}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Rate Limiting",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "Without a Real Limit, a Client Can Send Requests as Fast as the Network Allows",
              description: "Maybe it's a bug causing endless retries. Maybe it's someone trying to guess a password over and over.",
            },
            {
              label: "express-rate-limit Adds a Real Limit, in Just a Few Lines",
              description: "A real 60-second window, a real countable maximum, and real RateLimit-* headers reporting exactly how many requests are left.",
            },
            {
              label: "The Limiter Is Route-Specific Middleware",
              description: "It's declared in routes/limited.routes.js, right next to the one route it protects — not buried in server.js as a global default.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          A real rate limit turns an unbounded risk into a countable one — a real, fixed maximum per client per
          window, enforced by the server, not hoped for.
        </Callout>
        <p>
          The demo below sends 7 real requests, one after another, to a rule that only allows 5 every 60 seconds. The
          first 5 go through fine, and a real RateLimit-Remaining header counts down to 0 as they go. The 6th and 7th
          get a real 429 reply — &quot;too many requests.&quot; We also found something real worth knowing: by
          default, express-rate-limit sends back plain text, not JSON. This example changes that to real JSON, since
          that&apos;s what a real API should send.
        </p>
      </>
    ),
    extra: <RateLimitDiagram />,
    demo: <RateLimitingRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/RateLimiting/routes/limited.routes.js", note: "Declares the one route AND the real rate-limit config that protects it, right next to each other." },
      { path: "examples/SecurityRateLimiting/RateLimiting/controllers/limited.controller.js", note: "The trivial real handler — only ever reached once the real limiter has let a request through." },
      { path: "examples/SecurityRateLimiting/RateLimiting/demo.js", note: "Fires 7 real requests and shows the real 200→429 transition with real headers." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/SecurityRateLimiting/RateLimiting"
        runCommand="node server.js"
        runPort={4062}
        steps={[
          { method: "GET", path: "/limited", note: "Request 1 of 7, sent one after another with no delay.", expectStatus: 200, expectBody: '{"data":"this request was allowed through"}', expectHeaders: { "RateLimit-Remaining": "4" } },
          { method: "GET", path: "/limited", note: "Request 2.", expectStatus: 200, expectBody: '{"data":"this request was allowed through"}', expectHeaders: { "RateLimit-Remaining": "3" } },
          { method: "GET", path: "/limited", note: "Request 3.", expectStatus: 200, expectBody: '{"data":"this request was allowed through"}', expectHeaders: { "RateLimit-Remaining": "2" } },
          { method: "GET", path: "/limited", note: "Request 4.", expectStatus: 200, expectBody: '{"data":"this request was allowed through"}', expectHeaders: { "RateLimit-Remaining": "1" } },
          { method: "GET", path: "/limited", note: "Request 5 — the window is now full.", expectStatus: 200, expectBody: '{"data":"this request was allowed through"}', expectHeaders: { "RateLimit-Remaining": "0" } },
          { method: "GET", path: "/limited", note: "Request 6, same 60-second window — the real limit has been reached.", expectStatus: 429, expectBody: '{"error":"too many requests, please try again later"}', expectHeaders: { "RateLimit-Remaining": "0" } },
          { method: "GET", path: "/limited", note: "Request 7 — still blocked. Wait 60 real seconds for the window to reset.", expectStatus: 429, expectBody: '{"error":"too many requests, please try again later"}', expectHeaders: { "RateLimit-Remaining": "0" } },
        ]}
      />
    ),
  },
  {
    heading: "Helmet for Security Misconfiguration",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Default Express Headers Quietly Give Away Information",
              description: "One header, X-Powered-By: Express, tells an attacker exactly what framework you're using — a free hint. The default also leaves off several real, well-known browser protections.",
            },
            {
              label: "helmet Turns All of That On, in One Line",
              description: "A real batch of protective HTTP response headers — set once, applied to every real response the app sends.",
            },
            {
              label: "Same Route, Same Controller, Different Middleware",
              description: "Both real apps share the exact same routes/root.routes.js and controllers/root.controller.js — the ONLY difference between them is whether helmet() is wired into server.js.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          OWASP calls this &quot;Security Misconfiguration&quot; — helmet doesn&apos;t add new logic, it just turns on
          sane, real header defaults most teams forget to set themselves.
        </Callout>
        <p>
          The demo below runs two real Express apps side by side and prints the ACTUAL headers each one sends back.
          Without helmet: X-Powered-By is there, and nothing else is. With helmet(): X-Powered-By is gone, and a few
          real protective headers show up instead, like Content-Security-Policy and X-Frame-Options.
        </p>
      </>
    ),
    extra: <HeaderComparisonDiagram />,
    demo: <HelmetSecurityHeadersRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/SecurityRateLimiting/HelmetSecurityHeaders/routes/root.routes.js", note: "The one real route both apps share — identical on purpose." },
      { path: "examples/SecurityRateLimiting/HelmetSecurityHeaders/controllers/root.controller.js", note: "The trivial shared handler — the real difference between the two apps is entirely in their headers, not this logic." },
      { path: "examples/SecurityRateLimiting/HelmetSecurityHeaders/server.js", note: "Wires up two real apps on two real ports — one plain, one with helmet() — so both can be hit and compared directly." },
      { path: "examples/SecurityRateLimiting/HelmetSecurityHeaders/demo.js", note: "Fetches both real apps and prints the actual header differences." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/SecurityRateLimiting/HelmetSecurityHeaders"
        runCommand="node server.js"
        runPort={4076}
        extraPorts={[{ port: 4063, label: "the WITH-helmet app" }]}
        steps={[
          {
            method: "GET",
            path: "/",
            port: 4076,
            note: "The WITHOUT-helmet app.",
            expectStatus: 200,
            expectBody: '{"ok":true}',
            expectHeaders: {
              "X-Powered-By": "Express",
              "X-Content-Type-Options": "(not set)",
              "X-Frame-Options": "(not set)",
              "X-Dns-Prefetch-Control": "(not set)",
              "Strict-Transport-Security": "(not set)",
              "Content-Security-Policy": "(not set)",
              "Cross-Origin-Opener-Policy": "(not set)",
              "Cross-Origin-Resource-Policy": "(not set)",
              "Referrer-Policy": "(not set)",
            },
          },
          {
            method: "GET",
            path: "/",
            port: 4063,
            note: "The WITH-helmet app.",
            expectStatus: 200,
            expectBody: '{"ok":true}',
            expectHeaders: {
              "X-Powered-By": "(not set)",
              "X-Content-Type-Options": "nosniff",
              "X-Frame-Options": "SAMEORIGIN",
              "X-Dns-Prefetch-Control": "off",
              "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
              "Content-Security-Policy": "default-src 'self'; base-uri 'self'; ... (a real, full policy string)",
              "Cross-Origin-Opener-Policy": "same-origin",
              "Cross-Origin-Resource-Policy": "same-origin",
              "Referrer-Policy": "no-referrer",
            },
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. BOLA is the most common real weak spot in APIs — about 88% of checked Node APIs have it. The fix
        is not a better login check. It&apos;s one more check, done after login: does this user actually own this
        thing? SQL injection happens while a query is being put together, not inside any one specific database.
        Joining text together is the bug. Keeping user input separate is the fix. Rate limiting puts a real,
        countable limit on how many requests one client can send, and sends back a real 429 once that limit is
        passed. helmet turns on a whole set of real, protective headers that most teams forget to set themselves.
        And every one of these four examples follows the same real layering as any other Express resource — routes
        declare the endpoint, a controller holds the actual logic — including the SQL injection demo, which is a
        real login API now, not a bare script calling the database directly.
      </p>
    ),
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

import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import PasswordHashingBcryptRunner from "@/example-runners/AuthPatternsExpress/PasswordHashingBcryptRunner";
import SessionBasedAuthRunner from "@/example-runners/AuthPatternsExpress/SessionBasedAuthRunner";
import JwtBasedAuthRunner from "@/example-runners/AuthPatternsExpress/JwtBasedAuthRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-18.

function SaltRandomnessDiagram() {
  const steps: { label: string; caption: string; tone: "orange" | "green" | "red" }[] = [
    { label: "1. POST /users/register — \"ada\", the shared password", caption: "bcrypt mixes in a real, random salt — a genuinely new hash gets stored for ada.", tone: "orange" },
    { label: "2. POST /users/register — \"grace\", the SAME shared password", caption: "A DIFFERENT real hash comes back, even though the password typed in was identical.", tone: "orange" },
    { label: "3. Compare hash 1 and hash 2 directly", caption: "Not equal — checked directly. This is correct, not a bug. Two matching hashes would mean two users share a password, which a real attacker could exploit.", tone: "red" },
    { label: "4. POST /users/login — ada, the REAL password", caption: "bcrypt.compare() re-derives the hash using the salt already stored inside it — a real match, 200.", tone: "green" },
    { label: "5. POST /users/login — ada, a WRONG password", caption: "The re-derived hash doesn't match what's stored — a real reject, 401.", tone: "green" },
  ];
  const toneClasses: Record<string, string> = {
    orange: "border-orange-500 bg-orange-500/3 text-orange-500",
    green: "border-green-500 bg-green-500/3 text-green-500",
    red: "border-red-500 bg-red-500/3 text-red-500",
  };
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The same password, registered twice — checked directly against the running server</div>
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div key={step.label} className={`rounded-card border px-3 py-2 ${toneClasses[step.tone]}`}>
            <div className="font-mono text-xs font-semibold">{step.label}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{step.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-blue-500 bg-blue-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-blue-500 text-xs">The stored hash is never compared with ===. bcrypt.compare() re-runs the SAME salted process and checks if the result matches.</span>
      </div>
    </div>
  );
}

function SessionLifecycleDiagram() {
  const steps: { label: string; caption: string; tone: "red" | "orange" | "green" }[] = [
    { label: "1. GET /me — no cookie at all", caption: "The server has no session to look up — a real 401.", tone: "red" },
    { label: "2. POST /login — correct username & password", caption: "The server creates a REAL session object and stores it on its own side. The client only gets a random id back, inside Set-Cookie.", tone: "orange" },
    { label: "3. GET /me — WITH that real cookie", caption: "The server looks up the id from the cookie, finds the real session, sends back the real user — 200.", tone: "green" },
    { label: "4. POST /logout — same cookie", caption: "req.session.destroy() really deletes the session on the SERVER side, right now.", tone: "orange" },
    { label: "5. GET /me — the SAME cookie again", caption: "The client still physically has the cookie, but the server-side record is gone — a real 401 again.", tone: "red" },
  ];
  const toneClasses: Record<string, string> = {
    red: "border-red-500 bg-red-500/3 text-red-500",
    orange: "border-orange-500 bg-orange-500/3 text-orange-500",
    green: "border-green-500 bg-green-500/3 text-green-500",
  };
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The full real session lifecycle — checked directly against the running server</div>
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div key={step.label} className={`rounded-card border px-3 py-2 ${toneClasses[step.tone]}`}>
            <div className="font-mono text-xs font-semibold">{step.label}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{step.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-purple-500 bg-purple-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-purple-500 text-xs">The SERVER decides who is logged in, not the cookie. The cookie is just a key — useless the moment the server deletes what it points to.</span>
      </div>
    </div>
  );
}

function JwtLifecycleDiagram() {
  const steps: { label: string; caption: string; tone: "orange" | "cyan" | "green" | "red" }[] = [
    { label: "1. POST /login — correct username & password", caption: "The server hands back a real signed token — and stores NOTHING about this login on its own side.", tone: "orange" },
    { label: "2. Decode the payload with plain base64 — no secret used", caption: "It reads right out — { userId, username, iat, exp }. This proves the payload isn't encrypted, just encoded.", tone: "cyan" },
    { label: "3. GET /me with the real, untouched token", caption: "requireAuth re-verifies the real signature — it matches, 200.", tone: "green" },
    { label: "4. GET /me with ONE character flipped in the payload", caption: "The signature was computed over the ORIGINAL bytes — it no longer matches the changed payload. Real 401.", tone: "red" },
  ];
  const toneClasses: Record<string, string> = {
    orange: "border-orange-500 bg-orange-500/3 text-orange-500",
    cyan: "border-cyan-500 bg-cyan-500/3 text-cyan-500",
    green: "border-green-500 bg-green-500/3 text-green-500",
    red: "border-red-500 bg-red-500/3 text-red-500",
  };
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The full real JWT lifecycle, including a real tampering attempt — checked directly against the running server</div>
      <div className="flex flex-col gap-2 mb-3">
        {steps.map((step) => (
          <div key={step.label} className={`rounded-card border px-3 py-2 ${toneClasses[step.tone]}`}>
            <div className="font-mono text-xs font-semibold">{step.label}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{step.caption}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">SESSION: state lives on the SERVER</div>
          <div className="text-body text-xs leading-relaxed">The client holds only a meaningless random id. Logout is instant everywhere, since deleting the server record kills it right away.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">JWT: state lives on the CLIENT</div>
          <div className="text-body text-xs leading-relaxed">The server stores nothing, so it scales easily across many servers — but there&apos;s no server-side record to delete for an early logout.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Password Hashing with bcrypt",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "A Real Password Must Never Be Saved as Plain Text",
              description: "Real databases do leak sometimes. If that happens, every single user's real password leaks with it — and people often reuse the same password on other accounts too.",
            },
            {
              label: "bcrypt Turns a Password Into a One-Way Hash",
              description: "It's cheap to check a login guess against, but genuinely hard to turn back into the original password.",
            },
            {
              label: "A Random Salt Is Mixed In Every Single Time",
              description: "This is exactly what stops two users with the same password from having matching rows in a database — and defeats precomputed lookup-table attacks.",
              example: "bcrypt.hash(password, 10) — the 10 is the salt rounds, not the salt itself; a fresh random salt is generated internally on every call.",
            },
            {
              label: "This Is a Real, Layered Express API, Same as Every Other Section",
              description: "server.js wires things together, routes/users.routes.js declares the endpoints, and controllers/users.controller.js is the ONLY file that actually calls bcrypt — never a bare script.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          bcrypt&apos;s hash is one-way and salted — checking a login guess always costs a real bcrypt.compare() call,
          never a straight === comparison of stored text.
        </Callout>
        <p>
          The demo below registers the SAME real password under two different usernames through the real API. It
          gets two DIFFERENT real hashes back — correct, not a bug. Then it proves compare() both ways: the real
          password logs in (200), and a wrong guess is rejected (401).
        </p>
      </>
    ),
    extra: <SaltRandomnessDiagram />,
    demo: <PasswordHashingBcryptRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/AuthPatternsExpress/PasswordHashingBcrypt/routes/users.routes.js", note: "Declares which path/method maps to which controller function — no bcrypt code here at all." },
      { path: "examples/AuthPatternsExpress/PasswordHashingBcrypt/controllers/users.controller.js", note: "The ONLY file that calls bcrypt.hash and bcrypt.compare — real salted hashing and verification." },
      { path: "examples/AuthPatternsExpress/PasswordHashingBcrypt/demo.js", note: "Calls the real, running API over real HTTP — this file never imports bcrypt at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/AuthPatternsExpress/PasswordHashingBcrypt"
        runCommand="node server.js"
        runPort={4074}
        steps={[
          {
            method: "POST",
            path: "/users/register",
            body: JSON.stringify({ username: "ada", password: "correct-horse-battery-staple" }, null, 2),
            expectStatus: 201,
            expectBody: 'A real user object with a real bcrypt hash, e.g. {"id":1,"username":"ada","passwordHash":"$2b$10$..."}',
          },
          {
            method: "POST",
            path: "/users/login",
            body: JSON.stringify({ username: "ada", password: "correct-horse-battery-staple" }, null, 2),
            expectStatus: 200,
            expectBody: '{"ok":true,"username":"ada"}',
          },
          {
            method: "POST",
            path: "/users/login",
            body: JSON.stringify({ username: "ada", password: "nope" }, null, 2),
            expectStatus: 401,
            expectBody: '{"error":"invalid username or password"}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Session-Based Authentication",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "The SERVER Keeps the Real State",
              description: "After a real login, the server makes a real session and saves it on its own side. This example saves it in memory — a real production app would use a shared store like Redis, since in-memory sessions disappear whenever the server restarts.",
            },
            {
              label: "The Cookie Is Meaningless On Its Own",
              description: "The client only ever gets a small, random session id inside a cookie. It never gets the real session data itself.",
            },
            {
              label: "Logout Is Instant and Total",
              description: "Destroying the session server-side immediately invalidates the cookie everywhere it's used — there's nothing left to look up.",
            },
            {
              label: "Same Layering as Every Other Section",
              description: "server.js wires in the session middleware (real app-level config), routes/auth.routes.js declares the endpoints, and controllers/auth.controller.js is the ONLY file that touches req.session directly.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          The real session lives on the SERVER, not in the cookie — that&apos;s what makes logout instant and
          complete, and why the server, not the client, decides who&apos;s really logged in.
        </Callout>
        <p>
          The demo below proves the whole real cycle, on the actual running server. No cookie means no access (401).
          A real login sets a real cookie. That same cookie, sent back later, really unlocks the protected page. Then
          a real logout deletes the session on the server — after that, the SAME cookie stops working, even though
          the client still has it.
        </p>
      </>
    ),
    extra: <SessionLifecycleDiagram />,
    demo: <SessionBasedAuthRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/AuthPatternsExpress/SessionBasedAuth/routes/auth.routes.js", note: "Declares which path/method maps to which controller function — no session code here at all." },
      { path: "examples/AuthPatternsExpress/SessionBasedAuth/controllers/auth.controller.js", note: "The ONLY file that reads or writes req.session — real login, /me, and logout logic." },
      { path: "examples/AuthPatternsExpress/SessionBasedAuth/demo.js", note: "Captures the real Set-Cookie header and proves the full session lifecycle over real HTTP." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/AuthPatternsExpress/SessionBasedAuth"
        runCommand="node server.js"
        runPort={4051}
        steps={[
          { method: "GET", path: "/me", expectStatus: 401, expectBody: '{"error":"not logged in"} (no cookie sent yet)' },
          {
            method: "POST",
            path: "/login",
            body: JSON.stringify({ username: "ada", password: "correct-horse-battery-staple" }, null, 2),
            expectStatus: 200,
            expectBody: '{"ok":true} — Postman stores the real Set-Cookie automatically for you.',
          },
          { method: "GET", path: "/me", expectStatus: 200, expectBody: '{"id":1,"username":"ada"} (Postman resends the stored cookie automatically)' },
          { method: "POST", path: "/logout", expectStatus: 200, expectBody: '{"ok":true}' },
          { method: "GET", path: "/me", expectStatus: 401, expectBody: '{"error":"not logged in"} — same cookie, but the server-side session is really gone.' },
        ]}
      />
    ),
  },
  {
    heading: "JWT-Based Authentication",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "The Server Stores Nothing At All",
              description: "After login, the server hands out a real signed token with the user's info written right inside it. Every later request sends the token back, and the server just checks its real signature again — no list to look anything up in.",
            },
            {
              label: "The Payload Is Readable, Not Secret",
              description: "The token's info is base64-encoded, not locked away. Anyone holding the token can read it — never put a real secret inside one.",
            },
            {
              label: "The Signature Is What Actually Protects It",
              description: "Change even one letter inside a token, and the OLD signature no longer matches — it was made from the original letters. This is what a JWT actually promises: not secrecy, but catching tampering.",
            },
            {
              label: "requireAuth Is Real Middleware, Living in the Controller",
              description: "routes/auth.routes.js runs requireAuth BEFORE the real /me handler — the same routes-declare, controller-decides split as every other section, since the auth check is this resource's own logic.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          A JWT&apos;s real promise is tamper detection through its signature — not secrecy of its contents, and not
          an easy way to revoke it early the way destroying a session is.
        </Callout>
        <p>
          The demo below reads a real token&apos;s inside data using nothing but plain base64, proving it really
          isn&apos;t locked away. Then it proves the real safety check that matters: it changes just one letter
          inside a token, but keeps the same old signature — the server genuinely REJECTS it.
        </p>
      </>
    ),
    extra: <JwtLifecycleDiagram />,
    demo: <JwtBasedAuthRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/AuthPatternsExpress/JwtBasedAuth/routes/auth.routes.js", note: "Declares which path/method maps to which controller function, including requireAuth as real route middleware." },
      { path: "examples/AuthPatternsExpress/JwtBasedAuth/controllers/auth.controller.js", note: "The ONLY file that calls jwt.sign/jwt.verify — real signing, verification, and the requireAuth middleware itself." },
      { path: "examples/AuthPatternsExpress/JwtBasedAuth/demo.js", note: "Decodes a real payload, then proves a tampered token is really rejected, all over real HTTP." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/AuthPatternsExpress/JwtBasedAuth"
        runCommand="node server.js"
        runPort={4052}
        steps={[
          {
            method: "POST",
            path: "/login",
            body: JSON.stringify({ username: "ada", password: "correct-horse-battery-staple" }, null, 2),
            expectStatus: 200,
            expectBody: '{"token":"eyJhbGciOiJIUzI1NiIs..."} — a real signed JWT.',
          },
          {
            method: "GET",
            path: "/me",
            expectStatus: 200,
            expectBody: '{"id":1,"username":"ada"} — add header Authorization: Bearer <the real token from above>.',
          },
          { method: "GET", path: "/me", expectStatus: 401, expectBody: '{"error":"missing token"} (no Authorization header sent this time)' },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. bcrypt hashing is a must for any real saved password. The random salt in every hash is what
        stops attackers from using ready-made lookup tables — checked directly here: the same password, registered
        under two different usernames, produces two different real hashes. Sessions and JWTs answer the SAME
        question — &quot;who sent this request?&quot; — in two opposite ways. A session keeps the real information on
        the server, and gives the client only a meaningless id; logging out instantly works everywhere, checked
        directly by reusing the same cookie after logout and getting a real 401. A JWT gives the client the real
        signed info, and the server keeps nothing; this scales easily across many servers, but makes an early logout
        harder. Neither one is simply &quot;better.&quot; It&apos;s a real trade-off between easy logout and needing
        no server-side storage. And every one of these three examples follows the same real layering as any other
        Express resource — routes declare the endpoint, a controller holds the actual logic — because that&apos;s
        how a real backend team keeps auth code readable as it grows.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["real login", "bcrypt.compare against the stored hash", "issue a session cookie OR a signed JWT", "every later request: check the cookie's session OR re-verify the JWT signature"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "bcrypt's random salt (checked here: the same password hashes differently every time) is what stops lookup-table attacks and spotting reused passwords across users — this isn't a nice extra, it's the whole point.",
            "Sessions keep the real state on the server and give the client only a random id — logging out works right away, because deleting the server's record kills it instantly.",
            "JWTs keep nothing on the server — the token itself is the real credential, checked by its signature, not looked up — which scales easily, but makes an early logout genuinely harder without extra work.",
            "A JWT's payload is base64, not locked away — checked directly here by decoding one with nothing but base64 — never put a real secret inside a JWT payload.",
          ]}
        />
      </>
    ),
  },
];

export default function AuthPatternsExpressPage() {
  return (
    <StudyPage
      title="Authentication Patterns"
      stageLabel="Stage D — API Design & Real-World Concerns"
      stageColor="yellow"
      intro="Real password hashing with bcrypt (checking the salt for real, not just describing it), then the two real, opposite ways to answer 'who sent this request?' — sessions stored on the server, and self-contained signed JWTs — each one proven start to finish on a real, layered Express server."
      sections={sections}
    />
  );
}

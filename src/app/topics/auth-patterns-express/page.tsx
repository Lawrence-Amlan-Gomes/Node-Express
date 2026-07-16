import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PasswordHashingBcryptRunner from "@/example-runners/AuthPatternsExpress/PasswordHashingBcryptRunner";
import SessionBasedAuthRunner from "@/example-runners/AuthPatternsExpress/SessionBasedAuthRunner";
import JwtBasedAuthRunner from "@/example-runners/AuthPatternsExpress/JwtBasedAuthRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function StorageLocationDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-yellow-500 mb-2.5">Where the real &ldquo;who is this?&rdquo; information actually lives — the core difference:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">SESSION: the server keeps the real session data (in memory, or Redis, or a database). The client only holds a meaningless random id in a cookie. Deleting the session on the server shuts it down right away.</div>
      <div className="pl-2 mb-1.5 text-green-500">JWT: the server keeps NOTHING. The client holds the real, signed user info. The server just checks the signature again on every request — there&apos;s no server-side record to delete early.</div>
      <div className="mt-2 text-muted">
        Neither one is just &ldquo;more secure.&rdquo; They make a different real trade-off between easy logout and not needing any server-side storage.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Password Hashing with bcrypt",
    paragraphs: [
      "A real password must NEVER be saved as plain text. Real databases do leak sometimes. If that happens, every single user's real password leaks with it. People often reuse the same password on other accounts too. bcrypt turns a password into a one-way hash. It's cheap to check a login guess against. But it's really hard to turn back into the original password.",
      "The demo below hashes the SAME real password twice. It gets two DIFFERENT hashes back. This is correct, not a bug. bcrypt mixes in a real random extra value, called a salt, every single time. This is exactly what stops two users with the same password from having matching rows in a database. Then it checks both ways: the right password matches its own hash, and a wrong guess does not.",
    ],
    demo: <PasswordHashingBcryptRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/AuthPatternsExpress/PasswordHashingBcrypt/demo.js", note: "Real bcrypt.hash and bcrypt.compare — salted hashing and verification." },
    ],
  },
  {
    heading: "Session-Based Authentication",
    paragraphs: [
      "After a real login, the SERVER makes a real session and saves it on its own side. This example saves it in memory. A real production app would use a shared store like Redis instead, since in-memory sessions disappear whenever the server restarts. The client only ever gets a small, random session id inside a cookie. It never gets the real session data itself.",
      "The demo below proves the whole real cycle, on the actual running server. No cookie means no access (401). A real login sets a real cookie. That same cookie, sent back later, really unlocks the protected page. Then a real logout deletes the session on the server. After that, the SAME cookie stops working, even though the client still has it. This proves the server, not the cookie, is the one that actually decides.",
    ],
    extra: <StorageLocationDiagram />,
    demo: <SessionBasedAuthRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/AuthPatternsExpress/SessionBasedAuth/server.js", note: "A real express-session setup — login, a protected route, and logout." },
      { path: "examples/AuthPatternsExpress/SessionBasedAuth/demo.js", note: "Captures the real Set-Cookie header and proves the full session lifecycle." },
    ],
  },
  {
    heading: "JWT-Based Authentication",
    paragraphs: [
      "A JWT (JSON Web Token) does the opposite. The server stores NOTHING at all. After login, the server hands out a real signed token. The user's info is written right inside it. That info is base64-encoded, not locked away. Anyone holding the token can read it. Never put a real secret inside one. Every later request sends the token back. The server just checks its real signature again. There is no list to look anything up in.",
      "The demo below reads a real token's inside data using nothing but plain base64. This proves it really isn't locked away. Then it proves the real safety check that matters. It changes just one letter inside a token, but keeps the same old signature. The server genuinely REJECTS it. The signature was made from the original letters, so it no longer matches. This is what a JWT actually promises — not secrecy, but the ability to catch tampering.",
    ],
    demo: <JwtBasedAuthRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/AuthPatternsExpress/JwtBasedAuth/server.js", note: "Real jsonwebtoken signing and a real verification middleware." },
      { path: "examples/AuthPatternsExpress/JwtBasedAuth/demo.js", note: "Decodes a real payload, then proves a tampered token is really rejected." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. bcrypt hashing is a must for any real saved password. The random salt in every hash is what stops attackers from using ready-made lookup tables. We checked this directly: the same password hashed twice gives two different results. Sessions and JWTs answer the SAME question — \"who sent this request?\" — in two opposite ways. A session keeps the real information on the server, and gives the client only a meaningless id. Logging out instantly works everywhere. A JWT gives the client the real signed info, and the server keeps nothing. This scales easily across many servers, but makes an early logout harder. Neither one is simply \"better.\" It's a real trade-off between easy logout and needing no server-side storage.",
    ],
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
      intro="Real password hashing with bcrypt (checking the salt for real, not just describing it), then the two real, opposite ways to answer 'who sent this request?' — sessions stored on the server, and self-contained signed JWTs — each one proven start to finish on a real running Express server."
      sections={sections}
    />
  );
}

import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PreflightVsSimpleRunner from "@/example-runners/CorsFrontendHandshake/PreflightVsSimpleRunner";
import BrowserEnforcedBlockingRunner from "@/example-runners/CorsFrontendHandshake/BrowserEnforcedBlockingRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-18.

function PreflightDecisionDiagram() {
  const rows: { label: string; verdict: string; caption: string; tone: "green" | "orange" }[] = [
    { label: "GET /simple-data", verdict: "NO preflight", caption: "GET is one of the three CORS-safelisted \"simple\" methods (GET, HEAD, POST) — the browser sends it straight through.", tone: "green" },
    { label: "PUT /complex-data", verdict: "Real OPTIONS first", caption: "PUT is not safelisted at all — the browser asks permission with a real OPTIONS request before ever sending the real PUT.", tone: "orange" },
    { label: "POST /json-data (application/json)", verdict: "Real OPTIONS first", caption: "POST itself is safelisted, but application/json is NOT a safelisted content type — the JSON body is what triggers the real preflight here.", tone: "orange" },
  ];
  const toneClasses: Record<string, string> = {
    green: "border-green-500 bg-green-500/3 text-green-500",
    orange: "border-orange-500 bg-orange-500/3 text-orange-500",
  };
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The real, actual order requests arrived at the server — captured directly, not asserted</div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className={`rounded-card border px-3 py-2 ${toneClasses[row.tone]}`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-xs font-semibold">{row.label}</span>
              <span className="font-mono text-[11px] font-bold uppercase">{row.verdict}</span>
            </div>
            <div className="text-body text-xs leading-relaxed mt-1">{row.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-cyan-500 text-xs">A preflight is the browser asking &quot;am I allowed to do this?&quot; BEFORE it risks sending a real request with real side effects.</span>
      </div>
    </div>
  );
}

function BrowserEnforcementDiagram() {
  const rows: { label: string; caption: string; tone: "red" | "green" | "orange" }[] = [
    { label: "GET /no-cors — no Access-Control-Allow-Origin header", caption: "The server DID answer — the real data really left the server. The browser refuses to let the page's own JS read it. The real, exact console error: \"blocked by CORS policy.\"", tone: "red" },
    { label: "GET /with-cors — the right header IS present", caption: "The exact same kind of request, but the browser lets the page's own JS read the response this time.", tone: "green" },
    { label: "GET /whoami — plain fetch, no credentials option", caption: "The browser already has the real cookie stored for this origin. It still doesn't send it, because the CLIENT never opted in.", tone: "orange" },
    { label: "GET /whoami — fetch with credentials: 'include'", caption: "Same cookie, same browser, same origin — now it's sent, because BOTH the client opted in AND the server allowed credentials.", tone: "green" },
  ];
  const toneClasses: Record<string, string> = {
    red: "border-red-500 bg-red-500/3 text-red-500",
    green: "border-green-500 bg-green-500/3 text-green-500",
    orange: "border-orange-500 bg-orange-500/3 text-orange-500",
  };
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Four real requests, checked directly with a real headless browser</div>
      <div className="flex flex-col gap-2 mb-3">
        {rows.map((row) => (
          <div key={row.label} className={`rounded-card border px-3 py-2 ${toneClasses[row.tone]}`}>
            <div className="font-mono text-xs font-semibold">{row.label}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{row.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 text-center">
        <span className="text-yellow-500 text-xs">CORS is enforced by the BROWSER, not by Express or by Node&apos;s own fetch() — checked directly: a plain Node script hitting the exact same &quot;no-cors&quot; route still gets a real 200 back, with no blocking at all. This is why every demo here uses a real headless browser (Playwright), not a plain Node script.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Preflight — When the Browser Asks First",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Not Every Cross-Origin Request Gets a Real Check First",
              description: "The CORS rules name a small set of \"simple\" requests — GET, HEAD, or POST, with only a few allowed headers. The browser sends these straight through, trusting the server to say yes or no on the real reply.",
            },
            {
              label: "Anything Else Gets a Real OPTIONS Request FIRST",
              description: "A PUT, a DELETE, a JSON POST, or a custom header all count as \"non-simple.\" The browser asks the server's permission with a real OPTIONS request, before it ever sends the real one.",
            },
            {
              label: "Same Real Layering as Every Other Topic",
              description: "api-server.js just wires the app together, routes/api.routes.js declares which path/method maps to which controller, and controllers/api.controller.js holds the real (very small) response logic.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          A preflight is the browser protecting itself — checking permission BEFORE risking a real request with real
          side effects, for anything outside the small, safelisted &quot;simple&quot; set.
        </Callout>
        <p>
          The demo below proves this directly, using a real headless browser to hit a real Express API. A GET
          arrives with no check in front of it. A PUT and a JSON POST both get a real OPTIONS request right before
          them. We know this for sure, because the server logs every request that actually reaches it, in the real
          order it arrives.
        </p>
      </>
    ),
    extra: <PreflightDecisionDiagram />,
    demo: <PreflightVsSimpleRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CorsFrontendHandshake/PreflightVsSimple/routes/api.routes.js", note: "Declares which path/method maps to which controller function — no response logic here at all." },
      { path: "examples/CorsFrontendHandshake/PreflightVsSimple/controllers/api.controller.js", note: "The real (very small) handler logic behind each of the three routes." },
      { path: "examples/CorsFrontendHandshake/PreflightVsSimple/api-server.js", note: "Wires the app together — the cors() middleware, the request logger, and the mounted routes." },
      { path: "examples/CorsFrontendHandshake/PreflightVsSimple/demo.js", note: "Uses a real headless browser (Playwright) to make real cross-origin requests and capture the real request order." },
    ],
  },
  {
    heading: "The Browser Blocks It — the Server Never Refuses",
    body: (
      <>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "The SERVER Always Finishes and Answers",
              description: "CORS blocking happens entirely on the CLIENT side, inside the browser, AFTER the reply has already arrived — never on the server.",
            },
            {
              label: "The Browser Decides Whether the PAGE's Own JS Gets to Read It",
              description: "This protects the PERSON using the browser — think of a bad page quietly reading your bank's data, just because you happen to be logged in there. It does not protect the API itself.",
            },
            {
              label: "Cookies Need BOTH Sides to Say Yes",
              description: "A cookie already stored for an origin is NOT sent on a later cross-site request unless the CLIENT passes credentials: 'include' — and the SERVER has to allow credentials too.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="yellow">
          CORS protects the PERSON using the browser, not the API — the server&apos;s only real job is sending the
          right headers; the browser decides what to do with them, after the fact.
        </Callout>
        <p>
          The demo below uses a real headless browser to hit two real routes. One has no CORS setup at all — the
          fetch call itself throws inside the page, and the REAL browser error message, captured word for word,
          explains exactly why. The other is set up to allow the real page making the request, and the same kind of
          data is read successfully this time. It also proves the real cookie rule: the same route reports no cookie
          without the client&apos;s option, and the real cookie with it.
        </p>
      </>
    ),
    extra: <BrowserEnforcementDiagram />,
    demo: <BrowserEnforcedBlockingRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CorsFrontendHandshake/BrowserEnforcedBlocking/routes/api.routes.js", note: "Declares which path/method maps to which controller — including which real cors() config (or deliberately none) runs in front of each one." },
      { path: "examples/CorsFrontendHandshake/BrowserEnforcedBlocking/controllers/api.controller.js", note: "The real handler logic behind all four routes — the no-CORS route, the CORS-allowed route, and the cookie flow." },
      { path: "examples/CorsFrontendHandshake/BrowserEnforcedBlocking/api-server.js", note: "Wires the app together and mounts the real routes." },
      { path: "examples/CorsFrontendHandshake/BrowserEnforcedBlocking/demo.js", note: "A real headless browser captures the real blocked/allowed outcomes and the real console error text." },
    ],
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. CORS is a rule enforced by the BROWSER, full stop. We checked this directly: Node&apos;s own
        fetch() sends no preflight and blocks nothing at all. A server with zero CORS headers still fully answers
        every request. What the browser is really protecting is the USER, not the API — stopping a bad page from
        quietly reading data from a site the user happens to be logged into. Preflight, a real OPTIONS request, only
        happens for &quot;non-simple&quot; requests — custom methods like PUT/DELETE, custom headers, or content
        types like JSON. Cookies crossing to another site need BOTH sides to say yes: the client&apos;s fetch call,
        AND the server&apos;s CORS setup. That&apos;s exactly the kind of small detail that&apos;s easy to get wrong
        at a real job, and worth stating clearly in an interview.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["frontend page makes a cross-origin fetch", "\"simple\"? → sent straight through", "not simple? → real OPTIONS preflight first, asking permission", "response arrives either way", "browser checks Access-Control-Allow-Origin → lets JS read it, or blocks it"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "CORS is enforced by the browser, to protect the USER — not the server, and not the API. A server with no CORS headers still answers every request fully; the browser decides whether the page's own JS gets to see it.",
            "Preflight (a real OPTIONS request) only happens for non-simple requests — custom methods, custom headers, or content types like application/json — proven directly by watching the real order requests arrive in.",
            "Cookies crossing to another origin need both sides to say yes: the server sets Access-Control-Allow-Credentials: true with one specific real origin (never a wildcard), and the client passes credentials: 'include' on its own fetch call.",
            "This is the real, wire-level handshake between a backend and a separate frontend team's app — the exact setup a backend dev owns, and a frontend dev depends on.",
          ]}
        />
      </>
    ),
  },
];

export default function CorsFrontendHandshakePage() {
  return (
    <StudyPage
      title="CORS — the Frontend Handshake"
      stageLabel="Stage D — API Design & Real-World Concerns"
      stageColor="yellow"
      intro="The real, wire-level handshake between a backend and a separate frontend team's app, proven with a real headless browser. CORS turns out to be a rule the browser enforces — checked directly here, it doesn't exist at all in plain Node fetch() calls — so only a real browser can honestly prove it."
      sections={sections}
    />
  );
}

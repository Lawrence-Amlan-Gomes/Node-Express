import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PreflightVsSimpleRunner from "@/example-runners/CorsFrontendHandshake/PreflightVsSimpleRunner";
import BrowserEnforcedBlockingRunner from "@/example-runners/CorsFrontendHandshake/BrowserEnforcedBlockingRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function WhoEnforcesDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-yellow-500 mb-2.5">A really common mix-up, worth clearing up directly:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">CORS is NOT enforced by your Express server, and NOT by Node&apos;s own fetch() either — checked directly: a plain Node script hitting an API with zero CORS headers still gets a real 200 back, with no blocking at all.</div>
      <div className="pl-2 mb-1.5 text-green-500">CORS is enforced by the BROWSER, to protect the real PERSON using it from a bad page quietly reading data from another site they happen to be logged into. Your server&apos;s only real job is to send the right headers — the browser decides what to do with them.</div>
      <div className="mt-2 text-muted">
        This is why every demo on this page uses a real headless browser (Playwright), not a plain Node script — there is no other honest way to prove real CORS behavior.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Preflight — When the Browser Asks First",
    paragraphs: [
      "Not every request to another site gets a real check first. The CORS rules name a small set of \"simple\" requests — GET, HEAD, or POST, with only a few allowed headers. The browser sends these straight through. It trusts the server to say yes or no on the real reply. Anything else — a PUT, a DELETE, a JSON POST, or a custom header — gets a real OPTIONS request sent FIRST. This asks the server's permission, before the browser ever sends the real request.",
      "The demo below proves this directly, using a real headless browser to hit a real Express API. A GET arrives with no check in front of it. A PUT and a JSON POST both get a real OPTIONS request right before them. We know this for sure, because the server logs every request that actually reaches it, in the real order it arrives.",
    ],
    demo: <PreflightVsSimpleRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CorsFrontendHandshake/PreflightVsSimple/api-server.js", note: "A real Express API using the cors package, logging every request that actually arrives." },
      { path: "examples/CorsFrontendHandshake/PreflightVsSimple/demo.js", note: "Uses a real headless browser (Playwright) to make real cross-origin requests and capture the real request order." },
    ],
  },
  {
    heading: "The Browser Blocks It — the Server Never Refuses",
    paragraphs: [
      "Here's the single most important fact about CORS, and the one most people get wrong. The SERVER always finishes its work and sends back a real reply. CORS blocking happens entirely on the CLIENT side, inside the browser, after the reply has already arrived. The browser decides whether the page's own JavaScript is allowed to actually read it. This protects the PERSON using the browser — think of a bad page quietly reading your bank's data, just because you happen to be logged in there. It does not protect the API itself.",
      "The demo below uses a real headless browser to hit two real routes. One has no CORS setup at all. The fetch call itself throws \"Failed to fetch\" inside the page. The REAL browser error message, captured word for word, explains exactly why. The other route is set up to allow the real page making the request. It's the same data — but this time it's read successfully by the page's own JS.",
      "It also proves the real rule about cookies. A cookie set by the API is NOT sent on a later cross-site request, unless the CLIENT says credentials: 'include' — even though the browser already has that cookie saved. The SERVER has to agree too. Both sides really do have to say yes. This was checked directly: the same route reports no cookie without the client's option, and the real cookie with it.",
    ],
    extra: <WhoEnforcesDiagram />,
    demo: <BrowserEnforcedBlockingRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CorsFrontendHandshake/BrowserEnforcedBlocking/api-server.js", note: "Two real routes side by side — one with no CORS config, one properly configured — plus a real credentialed cookie flow." },
      { path: "examples/CorsFrontendHandshake/BrowserEnforcedBlocking/demo.js", note: "A real headless browser captures the real blocked/allowed outcomes and the real console error text." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. CORS is a rule enforced by the BROWSER, full stop. We checked this directly: Node's own fetch() sends no preflight and blocks nothing at all. A server with zero CORS headers still fully answers every request. What the browser is really protecting is the USER, not the API — stopping a bad page from quietly reading data from a site the user happens to be logged into. Preflight, a real OPTIONS request, only happens for \"non-simple\" requests — custom methods like PUT/DELETE, custom headers, or content types like JSON. Cookies crossing to another site need BOTH sides to say yes: the client's fetch call, AND the server's CORS setup. That's exactly the kind of small detail that's easy to get wrong at a real job, and worth stating clearly in an interview.",
    ],
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

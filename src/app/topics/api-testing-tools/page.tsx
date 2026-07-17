import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import CurlDemoRunner from "@/example-runners/ApiTestingTools/CurlDemoRunner";
import PostmanCollectionRunner from "@/example-runners/ApiTestingTools/PostmanCollectionRunner";
import HttpRequestFileRunner from "@/example-runners/ApiTestingTools/HttpRequestFileRunner";
import PostmanMockUI from "@/components/PostmanMockUI";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md (every section needs its
// OWN diagram; a live demo doesn't substitute for one). Rewritten 2026-07-17.
// Note: section 2's diagram is PostmanMockUI itself (imported above) — a
// real, detailed illustration already satisfies the rule, no second one
// needed there.

function CurlAnatomyDiagram() {
  const parts: { piece: string; caption: string }[] = [
    { piece: "curl", caption: "The program itself — installed by default on almost every Mac, Linux box, and CI machine." },
    { piece: "-s", caption: "Silent — hides curl's own progress bar, so only the real response prints." },
    { piece: "-X POST", caption: "Sets the HTTP method. Left out entirely, curl defaults to GET." },
    { piece: '-H "Content-Type: application/json"', caption: "Adds a real header — here, telling the server the body below is JSON." },
    { piece: "-d '{\"text\":\"...\"}'", caption: "Sends a real request body. Also implies POST if -X isn't given." },
    { piece: "http://localhost:4010/todos", caption: "The real URL being requested — same as any other tool would send." },
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real curl command, piece by piece</div>
      <div className="flex flex-col gap-2">
        {parts.map((part) => (
          <div key={part.piece} className="rounded-card border border-border bg-surface-raised px-3 py-2">
            <div className="font-mono text-xs font-semibold text-cyan-500 break-all">{part.piece}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{part.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HttpFileAnatomyDiagram() {
  const parts: { piece: string; caption: string }[] = [
    { piece: "### Create a new todo", caption: "Starts a new request block. Everything until the next ### belongs to this one request." },
    { piece: "POST http://localhost:4012/todos", caption: "Method and URL on one line — no flags, no quoting, just plain text." },
    { piece: "Content-Type: application/json", caption: "A real header, written exactly as it would appear on the wire." },
    { piece: '{ "text": "..." }', caption: "A blank line, then the real request body — plain JSON, nothing escaped." },
  ];
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One block inside requests.http, piece by piece</div>
      <div className="flex flex-col gap-2">
        {parts.map((part) => (
          <div key={part.piece} className="rounded-card border border-border bg-surface-raised px-3 py-2">
            <div className="font-mono text-xs font-semibold text-green-500 break-all">{part.piece}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{part.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-cyan-500 text-xs">No app to open, no JSON schema to generate — it&apos;s a real file, reviewable in a pull request.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "You've Already Been Watching This Tool: curl",
    body: (
      <>
        <p>
          Every single demo in this app so far has been verified with curl behind the scenes. It&apos;s the universal,
          always-installed, terminal-based way to send a real HTTP request — no install, no GUI, no extension. Just a command.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "A Plain GET Request",
              description: "The simplest possible curl command — just a URL. curl defaults to a real GET request.",
              example: "curl -s http://localhost:PORT/some/path",
            },
            {
              label: "Changing the Method, Adding Headers and a Body",
              description: "-X changes the method, -H adds a real header, -d sends a real request body — the same three things every HTTP request tool needs.",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          curl is available on basically every server, container, and CI machine you&apos;ll ever touch professionally. When a
          GUI tool isn&apos;t installed (or isn&apos;t allowed) on a machine you&apos;re debugging on, curl still is — worth
          being genuinely comfortable with it, not just aware it exists.
        </Callout>
      </>
    ),
    extra: <CurlAnatomyDiagram />,
    demo: <CurlDemoRunner />,
    demoCommand: "node curl-demo.js",
    filePointers: [
      {
        path: "examples/ApiTestingTools/CurlWorkflow/curl-demo.js",
        note: "A real, self-contained todos API just for this — starts it on a fixed port, then runs these exact curl commands against it for real.",
      },
      {
        path: "examples/ApiTestingTools/CurlWorkflow/server.js",
        note: "The real todos API curl-demo.js starts and sends these requests to.",
      },
    ],
  },
  {
    heading: "GUI Tools: Postman and Thunder Client",
    body: (
      <>
        <p>
          curl is fast for a one-off request, but tedious for a whole API you&apos;re actively building — remembering every
          header and body by hand gets old. Postman and Thunder Client solve that: you save each request once, organize them
          into a collection, and click to (re)send instead of retyping a command.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "Postman — the Industry-Standard Choice",
              description:
                "A standalone desktop/web app. Real cloud sync, real team-shared collections, environments (swap a base URL between \"local\" and \"staging\" with one click), and scripting for things like auto-extracting a token from a login response into later requests.",
            },
            {
              label: "Thunder Client — Deliberately Lighter",
              description:
                "A lightweight VS Code extension. It lives right inside your editor, so there's no separate app to switch to — a real, common choice for smaller personal or solo projects like this one.",
            },
          ]}
        />
        <p>
          This example ships a real, importable Postman collection with four requests. Postman itself is a separate app you
          install yourself — it can&apos;t run inside this page — so below is a static illustration of what the real Postman
          window looks like with this exact collection open. Click a request in the sidebar to see its response change.
        </p>
        <Callout title="The Bottom Line" accent="orange">
          Every status code and response body in that illustration is the exact real result already verified below by actually
          running these requests against a real server — nothing in it is invented, only the surrounding window chrome is a
          mockup rather than a screenshot of the real app.
        </Callout>
      </>
    ),
    extra: <PostmanMockUI />,
    demo: <PostmanCollectionRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ApiTestingTools/PostmanCollection/postman-collection.json",
      note: "A real Postman Collection v2.1 file — File → Import in Postman, point it at this file, and every request above shows up ready to send.",
    },
  },
  {
    heading: "The Plain-Text Format Underneath: .http Files",
    body: (
      <>
        <p>
          There&apos;s a third option that&apos;s neither a terminal command nor a proprietary app format: a plain .http file.
          It&apos;s read directly by VS Code&apos;s &quot;REST Client&quot; extension, Thunder Client itself, and JetBrains
          IDEs&apos; built-in HTTP client.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "Each Request Is Just Plain Text",
              description: "A method, a URL, optional headers, and an optional body — separated by ### lines. No JSON schema to generate, no app to open.",
            },
            {
              label: "It's a Real File, Not App-Specific Data",
              description: "requests.http lives in your project and gets reviewed in a pull request like any other code — unlike a Postman collection, which lives inside Postman's own format.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          As with the Postman collection, the demo below sends those exact requests directly to prove they genuinely work —
          three different tools across this topic, all doing the identical underlying thing to the identical kind of API.
        </Callout>
      </>
    ),
    extra: <HttpFileAnatomyDiagram />,
    demo: <HttpRequestFileRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      {
        path: "examples/ApiTestingTools/HttpRequestFile/requests.http",
        note: "A real, plain-text request file — readable on its own even without the extension installed.",
      },
      {
        path: "examples/ApiTestingTools/HttpRequestFile/server.js",
        note: "A real, self-contained todos API just for this.",
      },
    ],
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap, in plain words: curl, Postman, Thunder Client, and .http files are all doing the exact same underlying
        thing — sending a real HTTP request and showing you the real response — just with different amounts of ceremony and
        persistence. None of them are &quot;more correct&quot; than the others; picking one is a workflow preference, not a
        technical requirement. What actually matters is being comfortable manually exploring an API you&apos;re building BEFORE
        writing automated tests for it (Stage E) — you need to know what it actually does before you can assert what it should
        do.
      </p>
    ),
    extra: (
      <ComparisonCard
        tone="good"
        title="What to say in the interview"
        points={[
          "curl is the lowest-common-denominator tool — no install, works on any server/container/CI box, worth being genuinely fluent in.",
          "Postman and Thunder Client save/organize requests into collections — the real productivity win once you're testing more than one or two endpoints repeatedly.",
          ".http files are plain text, reviewable in a PR, and readable even without the extension that runs them — a real, lightweight alternative to a proprietary collection format.",
          "Manually exploring an API (any of these tools) is a genuinely different activity from automated testing (Jest/Supertest, Stage E) — one is exploration, the other is a regression safety net.",
        ]}
      />
    ),
  },
];

export default function ApiTestingToolsPage() {
  return (
    <StudyPage
      title="API Testing Tools: curl, Postman & Thunder Client"
      stageLabel="Stage B — Express Fundamentals"
      stageColor="purple"
      intro="Now that there's a real Express app to poke at, here's how you'd actually explore it by hand — the same curl workflow already used to verify every demo in this app, plus the GUI alternatives (Postman, Thunder Client) and the plain-text .http format underneath them. Learning this first, before the rest of Stage B, means every later topic can lean on Postman directly instead of introducing it along the way."
      sections={sections}
    />
  );
}

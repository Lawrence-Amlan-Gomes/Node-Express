import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import ContractHandshakeRunner from "@/example-runners/WorkingWithFrontendTeams/ContractHandshakeRunner";
import OpenApiSwaggerDocsRunner from "@/example-runners/WorkingWithFrontendTeams/OpenApiSwaggerDocsRunner";
import MockingWithPrismRunner from "@/example-runners/WorkingWithFrontendTeams/MockingWithPrismRunner";
import ContractValidationMiddlewareRunner from "@/example-runners/WorkingWithFrontendTeams/ContractValidationMiddlewareRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function ContractDriftDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same real request, same real 200 — one silent, breaking change</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">v1 — GET /profile → {"{ id, name, email }"}</div>
          <div className="text-body text-xs leading-relaxed">The real, ORIGINAL shape a real frontend was built against. data.name reads a real string.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">v2 — GET /profile → {"{ id, fullName, email }"}</div>
          <div className="text-body text-xs leading-relaxed">A real backend dev renamed ONE field. Still valid JSON, still a real 200 — nothing here LOOKS broken.</div>
        </div>
        <div className="rounded-card border border-yellow-500/40 bg-yellow-500/3 px-3 py-2">
          <div className="font-mono text-xs text-yellow-500 font-semibold mb-0.5">The SAME unchanged frontend code, hitting v2</div>
          <div className="text-body text-xs leading-relaxed">data.name is now really undefined — a real, silent break, with no error, no failed request, nothing in a network tab to flag it.</div>
        </div>
      </div>
    </div>
  );
}

function OpenApiDocsDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real file, two real jobs</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">openapi.yaml — the real, plain-text contract</div>
          <div className="text-body text-xs leading-relaxed">Every real path, method, request body, and response shape — readable by a person OR a tool, with zero Express-specific knowledge required.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">swagger-ui-express reads it and builds a real page</div>
          <div className="text-body text-xs leading-relaxed">A real, interactive UI at /docs — a frontend dev can read every endpoint AND click &quot;Try it out&quot; to send a real request, with zero Postman setup.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">/openapi.json — the same real spec, machine-readable</div>
          <div className="text-body text-xs leading-relaxed">The exact same contract, served as raw JSON — what a real tool (a mock server, a codegen tool) actually consumes, proven in the very next section.</div>
        </div>
      </div>
    </div>
  );
}

function MockServerDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The real backend genuinely doesn&apos;t exist yet — Prism stands in for it</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">openapi.yaml — the real spec, with real example values</div>
          <div className="text-body text-xs leading-relaxed">No routes/, no controllers/, no real Express app in this section — on purpose. Just the contract.</div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">Prism (a real, standard open-source tool) reads that spec</div>
          <div className="text-body text-xs leading-relaxed">Serves REAL HTTP responses generated straight from it — matching real types, real required fields, real example data.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">A real frontend dev can start work TODAY</div>
          <div className="text-body text-xs leading-relaxed">Build real UI against real, schema-shaped responses, weeks before a real backend engineer writes the actual logic.</div>
        </div>
      </div>
    </div>
  );
}

function ValidationMiddlewareDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The contract stops being a promise and becomes a real, enforced gate</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">A real request arrives</div>
          <div className="text-body text-xs leading-relaxed">Before ANY route runs, express-openapi-validator checks it against the real openapi.yaml — body shape, field types, required fields, even path param types.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Violates the real spec → a real 400, controller never runs</div>
          <div className="text-body text-xs leading-relaxed">The exact per-field error, generated automatically — this project&apos;s own controller code never had to write this check itself.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">Matches the real spec → reaches the real controller</div>
          <div className="text-body text-xs leading-relaxed">req.body is now GUARANTEED to match the contract — no defensive re-checking needed inside the controller itself.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Why an API Contract Is the Real Handshake",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "An \"API Contract\" Is Just: What Shape Will You Send Me, and What Shape Will I Send Back",
              description: "Real or written down or not, every frontend/backend pair already has one, implicitly, the moment the frontend's code reads a specific field off a real response.",
            },
            {
              label: "Backend and Frontend Almost Always Build in Parallel, on Real Teams",
              description: "Neither side waits for the other to finish — which means the contract is the ONLY thing keeping both halves compatible while they change independently.",
              example: "This section's demo proves what happens the moment that contract quietly breaks: the exact same frontend code, unchanged, suddenly reads undefined.",
            },
            {
              label: "This Is a Real, Genuine Advantage From an Existing Frontend Background",
              description: "Having personally been the frontend dev staring at a silent undefined makes this pain real, not theoretical — a real, honest thing to say directly in an interview.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          A silent contract break is worse than a crash — a crash gets noticed immediately. This is exactly why
          the next three sections exist: writing the contract down, letting a frontend build against it before the
          backend is ready, and eventually enforcing it automatically instead of trusting everyone to remember it.
        </Callout>
        <p>
          The demo below runs two real, tiny Express apps — v1 honors the original contract, v2 silently renamed one
          field — and proves the exact same &quot;frontend&quot; code reads a real value from v1 and a real
          <code>undefined</code> from v2.
        </p>
      </>
    ),
    extra: <ContractDriftDiagram />,
    demo: <ContractHandshakeRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WorkingWithFrontendTeams/ContractHandshake/controllers/profile.controller.js", note: "v1 returns name; v2 returns fullName — the exact real drift this section proves." },
      { path: "examples/WorkingWithFrontendTeams/ContractHandshake/demo.js", note: "Plays the role of a real frontend consumer — reads data.name against both real versions." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/WorkingWithFrontendTeams/ContractHandshake"
        runCommand="node server.js"
        runPort={4119}
        extraPorts={[{ port: 4120, label: "v2, the drifted contract" }]}
        steps={[
          {
            method: "GET",
            path: "/profile",
            note: "Against port 4119 — v1, the original, honored contract.",
            expectStatus: 200,
            expectBody: '{"id":1,"name":"Ada Lovelace","email":"ada@example.com"}',
          },
          {
            method: "GET",
            path: "/profile",
            port: 4120,
            note: "Against port 4120 — v2, the same endpoint, silently renamed.",
            expectStatus: 200,
            expectBody: '{"id":1,"fullName":"Ada Lovelace","email":"ada@example.com"}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Writing a Real OpenAPI Spec, Served as Live, Interactive Docs",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "OpenAPI Is the Real, Standard Way to Write a Contract Down",
              description: "A plain-text (YAML or JSON) description of every real endpoint — paths, methods, request bodies, response shapes — that a frontend dev, a teammate, OR a tool can read.",
            },
            {
              label: "Swagger UI Turns That Spec Into a Real Page a Frontend Dev Can Actually Use",
              description: "Not just readable prose — a real, interactive page with a genuine \"Try it out\" button that sends a real request to the real running server and shows the real response.",
              example: "This section's demo confirms /docs really serves that page, and /openapi.json serves the exact same spec as raw, machine-readable JSON.",
            },
            {
              label: "Keep the Spec Next to the Code It Describes",
              description: "openapi.yaml lives in this same mini-project, describing the exact same routes/controllers one folder over — the standard way real teams avoid the spec quietly drifting out of sync with reality.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          A written contract a frontend dev can open, read, and try requests from — without ever touching this
          project&apos;s own Express code — is the real, practical fix for the silent drift the previous section
          proved.
        </Callout>
        <p>
          The demo below hits the real spec (as JSON), the real interactive docs page, and the real Products API
          those docs describe — proving all three are genuinely the same contract, not three separate claims.
        </p>
      </>
    ),
    extra: <OpenApiDocsDiagram />,
    demo: <OpenApiSwaggerDocsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WorkingWithFrontendTeams/OpenApiSwaggerDocs/openapi.yaml", note: "The real, plain-text contract — every path, method, and shape this API actually has." },
      { path: "examples/WorkingWithFrontendTeams/OpenApiSwaggerDocs/server.js", note: "Loads that real spec and serves it as real interactive docs at /docs, via swagger-ui-express." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/WorkingWithFrontendTeams/OpenApiSwaggerDocs"
        runCommand="node server.js"
        runPort={4121}
        steps={[
          {
            method: "GET",
            path: "/docs",
            note: "Better opened directly in a real browser, not Postman — this is a real, interactive Swagger UI page.",
            expectStatus: 200,
            expectBody: "A real, rendered Swagger UI page listing GET /products, POST /products, and GET /products/{id} — with a working \"Try it out\" button on each.",
          },
          {
            method: "GET",
            path: "/openapi.json",
            expectStatus: 200,
            expectBody: "The exact same spec as openapi.yaml, as real JSON.",
          },
          {
            method: "GET",
            path: "/products",
            expectStatus: 200,
            expectBody: '[{"id":1,"name":"Mechanical Keyboard","price":89.99},{"id":2,"name":"Ultrawide Monitor","price":429}]',
          },
          {
            method: "POST",
            path: "/products",
            body: '{\n  "name": "Standing Desk",\n  "price": 349.5\n}',
            expectStatus: 201,
            expectBody: '{"id":3,"name":"Standing Desk","price":349.5}',
          },
          {
            method: "GET",
            path: "/products/1",
            expectStatus: 200,
            expectBody: '{"id":1,"name":"Mechanical Keyboard","price":89.99}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Mocking the Backend Before It's Ready",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "A Frontend Dev Shouldn't Have to Wait for the Real Backend",
              description: "Once a real spec exists (the previous section), the actual Express implementation doesn't need to exist yet for a frontend dev to start building real UI against it.",
            },
            {
              label: "Prism Generates a Real Mock Server Straight From the Spec",
              description: "A real, standard open-source tool — reads openapi.yaml, serves genuinely schema-shaped, example-backed responses over real HTTP. No hand-written fake JSON files to keep in sync.",
              example: "This section's spec describes a Reviews API that has ZERO real Express code behind it anywhere in this project — Prism is the only thing answering these requests.",
            },
            {
              label: "It Even Enforces the Contract on the Way In",
              description: "Send Prism a request that violates the spec, and it rejects it with a real, detailed error — the exact same enforcement the next section builds directly into a real Express app.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          The spec isn&apos;t just documentation — it&apos;s a real, working stand-in for a backend that doesn&apos;t
          exist yet, letting frontend and backend work genuinely stops being sequential.
        </Callout>
        <p>
          The demo below spawns a real Prism mock server from a real spec, then proves a real GET, a real valid POST,
          and a real spec-violating POST all get genuine, correctly-shaped responses back — with no real backend
          code involved anywhere.
        </p>
      </>
    ),
    extra: <MockServerDiagram />,
    demo: <MockingWithPrismRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WorkingWithFrontendTeams/MockingWithPrism/openapi.yaml", note: "The ONLY real artifact in this mini-project — no server.js, no controllers, on purpose." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/WorkingWithFrontendTeams/MockingWithPrism"
        runCommand="npm run mock"
        runPort={4122}
        steps={[
          {
            method: "GET",
            path: "/reviews",
            expectStatus: 200,
            expectBody: '[{"id":1,"productId":42,"rating":5,"comment":"Genuinely great — would buy again."},{"id":2,"productId":42,"rating":3,"comment":"Fine, nothing special."}]',
          },
          {
            method: "POST",
            path: "/reviews",
            body: '{\n  "productId": 42,\n  "rating": 4,\n  "comment": "Solid, real value for the price."\n}',
            expectStatus: 201,
            expectBody: '{"id":3,"productId":42,"rating":4,"comment":"Solid, real value for the price."}',
          },
          {
            method: "POST",
            path: "/reviews",
            body: "{}",
            note: "A body that violates the spec — every required field missing.",
            expectStatus: 422,
            expectBody: 'A real Prism validation error object listing all three missing required fields (productId, rating, comment).',
          },
        ]}
      />
    ),
  },
  {
    heading: "Keeping the Contract Honest: Real Request Validation From the Spec",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "A Written Spec Can Still Quietly Drift From the Real Code",
              description: "Nothing stops a real Express route from silently diverging from openapi.yaml over time, UNLESS something actually checks every real request against it.",
            },
            {
              label: "express-openapi-validator Turns the Spec Into Real Middleware",
              description: "Wired in BEFORE the real routes — any request that violates openapi.yaml (wrong type, missing required field, even a wrong path-param type) gets a real, automatic 400. The controller never runs.",
              example: "This section's demo sends a string where the spec requires an integer — rejected automatically, with a real per-field error, before any of this project's own code executes.",
            },
            {
              label: "This Is the Senior-Level Version of Validation Already Mastered",
              description: "Same core idea as zod in \"REST Conventions & Validation\" — but defined ONCE, in the spec, and enforced everywhere, instead of hand-written per route.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          The contract stops being something a team has to remember to keep in sync — it becomes the real thing
          deciding, on every single request, whether that request is even allowed to reach application code.
        </Callout>
        <p>
          The demo below sends a real valid order (reaches the controller), three different real spec violations
          (all rejected automatically, before the controller runs), and a real valid-but-missing lookup (a genuine
          404 the controller itself decides, since that&apos;s not a contract violation).
        </p>
      </>
    ),
    extra: <ValidationMiddlewareDiagram />,
    demo: <ContractValidationMiddlewareRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WorkingWithFrontendTeams/ContractValidationMiddleware/openapi.yaml", note: "The real contract this section actually enforces, not just describes." },
      { path: "examples/WorkingWithFrontendTeams/ContractValidationMiddleware/server.js", note: "Wires the real spec in as real middleware, BEFORE any route can run." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/WorkingWithFrontendTeams/ContractValidationMiddleware"
        runCommand="node server.js"
        runPort={4123}
        steps={[
          {
            method: "POST",
            path: "/orders",
            body: '{\n  "productId": 42,\n  "quantity": 2\n}',
            expectStatus: 201,
            expectBody: '{"id":1,"productId":42,"quantity":2}',
          },
          {
            method: "POST",
            path: "/orders",
            body: '{\n  "productId": "not-a-number",\n  "quantity": 2\n}',
            note: "productId must be an integer per the spec.",
            expectStatus: 400,
            expectBody: '{"message":"request/body/productId must be integer","errors":[{"path":"/body/productId","message":"must be integer","errorCode":"type.openapi.validation"}]}',
          },
          {
            method: "POST",
            path: "/orders",
            body: '{\n  "productId": 42\n}',
            note: "quantity is required per the spec.",
            expectStatus: 400,
            expectBody: '{"message":"request/body must have required property \'quantity\'","errors":[{"path":"/body/quantity","message":"must have required property \'quantity\'","errorCode":"required.openapi.validation"}]}',
          },
          {
            method: "POST",
            path: "/orders",
            body: '{\n  "productId": 42,\n  "quantity": 0\n}',
            note: "quantity must be >= 1 per the spec.",
            expectStatus: 400,
            expectBody: '{"message":"request/body/quantity must be >= 1","errors":[{"path":"/body/quantity","message":"must be >= 1","errorCode":"minimum.openapi.validation"}]}',
          },
          {
            method: "GET",
            path: "/orders/1",
            expectStatus: 200,
            expectBody: '{"id":1,"productId":42,"quantity":2}',
          },
          {
            method: "GET",
            path: "/orders/abc",
            note: "id must be an integer per the spec — caught before the controller runs.",
            expectStatus: 400,
            expectBody: '{"message":"request/params/id must be integer","errors":[{"path":"/params/id","message":"must be integer","errorCode":"type.openapi.validation"}]}',
          },
          {
            method: "GET",
            path: "/orders/999",
            note: "A valid integer id that simply doesn't exist — not a contract violation, so the controller's own real 404 runs.",
            expectStatus: 404,
            expectBody: '{"error":"No order with id 999"}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. An API contract is real the moment a frontend reads a specific field off a real response —
        written down or not — proven here by two real app versions where one silently renamed a field and broke the
        exact same frontend code with no error at all. Writing that contract down as a real OpenAPI spec, and
        serving it as real interactive Swagger docs, turns an implicit assumption into something a frontend dev can
        actually read and try requests against. That same spec, fed to a real tool like Prism, becomes a real mock
        server — proven here answering requests for an API that has genuinely zero real backend code behind it,
        letting frontend work start before backend work finishes. And wiring that spec in as real, enforced
        middleware (express-openapi-validator) turns it from a promise into a gate — a request that violates the
        contract gets a real, automatic 400 before it ever reaches application code. The real interview-ready
        framing: a background actually building the frontend side of this exact handshake is a genuine
        differentiator, not a gap — it means understanding, firsthand, what a frontend team actually needs from a
        backend to move fast without breaking on every deploy.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["implicit contract", "silent drift breaks it", "write it down (OpenAPI)", "mock it before it's built", "enforce it automatically"]} />
        <ComparisonCard
          tone="good"
          title="What to actually say in the room"
          points={[
            "\"I've felt this from the frontend side — a renamed field with no version bump is a silent, hard-to-debug break, not a minor thing.\"",
            "\"I'd write the contract as an OpenAPI spec and serve it as real Swagger docs, so the frontend team never has to read my Express code to know what an endpoint returns.\"",
            "\"I'd hand the frontend team a real Prism mock generated from that same spec, so they're not blocked waiting on my implementation.\"",
            "\"I'd wire the spec in as real request-validation middleware, so drift becomes a real, automatic 400 instead of a silent surprise in production.\"",
          ]}
        />
      </>
    ),
  },
];

export default function WorkingWithFrontendTeamsPage() {
  return (
    <StudyPage
      title="Working With a Frontend Team"
      stageLabel="Stage F — Advanced & Interview Prep"
      stageColor="cyan"
      intro="The literal handshake between backend and frontend, built and proven for real: a silent contract break that actually happens, a real OpenAPI spec served as live interactive docs, a real mock server standing in for a backend that doesn't exist yet, and that same spec wired in as real, automatically-enforced request validation."
      sections={sections}
    />
  );
}

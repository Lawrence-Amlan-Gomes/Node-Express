import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import LiveCodingDrillRunner from "@/example-runners/BackendSystemDesignDrills/LiveCodingDrillRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function TimeBudgetDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A real ~40-minute budget, spent on purpose, not by accident</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-cyan-500/40 bg-cyan-500/3 px-3 py-2">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-0.5">~5 min — clarify, out loud</div>
          <div className="text-body text-xs leading-relaxed">What does a &quot;bookmark&quot; need? Pagination? Auth? Real interviewers are watching whether you ask BEFORE typing, not just whether the code works.</div>
        </div>
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">~15 min — skeleton first</div>
          <div className="text-body text-xs leading-relaxed">A full CRUD pass — routes, controllers, an in-memory store — reaching immediately for the layering you already know, not inventing structure live.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">~10 min — status codes + validation</div>
          <div className="text-body text-xs leading-relaxed">201 on create, 404 on missing, 400 on bad input via zod — all muscle memory from &quot;REST Conventions &amp; Validation,&quot; applied fast.</div>
        </div>
        <div className="rounded-card border border-yellow-500/40 bg-yellow-500/3 px-3 py-2">
          <div className="font-mono text-xs text-yellow-500 font-semibold mb-0.5">~10 min — one real edge case, narrated</div>
          <div className="text-body text-xs leading-relaxed">Pick ONE thing to show depth on — here, cursor pagination — and explain the tradeoff out loud instead of coding in silence.</div>
        </div>
      </div>
    </div>
  );
}

function InterviewAnchorsDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Three real things you already built, now reframed as real interview answers</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">&quot;How would you paginate a huge table?&quot;</div>
          <div className="text-body text-xs leading-relaxed">You measured it: cursor beat offset by roughly ~300x on a real Postgres table, because OFFSET forces a real scan-and-discard of every row before it.</div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">&quot;How do you make a POST safe to retry?&quot;</div>
          <div className="text-body text-xs leading-relaxed">You built it: an idempotency key, the real Stripe/PayPal pattern — the client sends the same key on retry, the server recognizes it and returns the ORIGINAL result instead of creating a duplicate.</div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">&quot;How do you stop one client from hammering your API?&quot;</div>
          <div className="text-body text-xs leading-relaxed">You built and curled it: real rate limiting, tracked per client, returning a real 429 with real RateLimit-Remaining headers once a real client crosses the line.</div>
        </div>
      </div>
    </div>
  );
}

function CapTheoremDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Pick two — but only once a real network partition is even possible</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-orange-500/40 bg-orange-500/3 px-3 py-2">
          <div className="font-mono text-xs text-orange-500 font-semibold mb-0.5">C — Consistency</div>
          <div className="text-body text-xs leading-relaxed">Every real read gets the most recent real write, or an error — never stale data.</div>
        </div>
        <div className="rounded-card border border-orange-500/40 bg-orange-500/3 px-3 py-2">
          <div className="font-mono text-xs text-orange-500 font-semibold mb-0.5">A — Availability</div>
          <div className="text-body text-xs leading-relaxed">Every real request gets SOME response — never a hang, even if that response might be stale.</div>
        </div>
        <div className="rounded-card border border-orange-500/40 bg-orange-500/3 px-3 py-2">
          <div className="font-mono text-xs text-orange-500 font-semibold mb-0.5">P — Partition Tolerance</div>
          <div className="text-body text-xs leading-relaxed">The real system keeps working even when a real network split cuts nodes off from each other.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3">
        <span className="text-yellow-500 text-xs leading-relaxed">A real network is never 100% reliable, so P isn&apos;t optional — the real choice CAP actually forces is C vs A, and only once a system genuinely has more than one node.</span>
      </div>
    </div>
  );
}

function LatencyNumbersDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The classic table every senior engineer keeps in their head — same shape as your own measured numbers</div>
      <div className="flex flex-col gap-1.5 font-mono text-xs">
        <div className="flex justify-between rounded px-2.5 py-1.5 bg-surface-raised border border-border">
          <span className="text-body">Main memory reference</span>
          <span className="text-green-500">~100 ns</span>
        </div>
        <div className="flex justify-between rounded px-2.5 py-1.5 bg-surface-raised border border-border">
          <span className="text-body">Read 4 KB randomly from SSD</span>
          <span className="text-green-500">~150 &micro;s</span>
        </div>
        <div className="flex justify-between rounded px-2.5 py-1.5 bg-surface-raised border border-border">
          <span className="text-body">Round trip, same real datacenter</span>
          <span className="text-yellow-500">~500 &micro;s</span>
        </div>
        <div className="flex justify-between rounded px-2.5 py-1.5 bg-surface-raised border border-border">
          <span className="text-body">Send 1 MB over a real 1 Gbps network</span>
          <span className="text-yellow-500">~10 ms</span>
        </div>
        <div className="flex justify-between rounded px-2.5 py-1.5 bg-surface-raised border border-border">
          <span className="text-body">Round trip, California &harr; Netherlands</span>
          <span className="text-red-500">~150 ms</span>
        </div>
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3">
        <span className="text-cyan-500 text-xs leading-relaxed">This project already proved the same shape for real: &quot;Microservices vs Monolith&quot; measured ~0.01ms for an in-process function call vs ~26-40ms for the identical operation over a real network — roughly the memory-vs-network gap in this table, just at your own app&apos;s scale.</span>
      </div>
    </div>
  );
}

function ShardingDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One table, too big for one real machine — where do the rows go?</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">The shard key IS the design decision</div>
          <div className="text-body text-xs leading-relaxed">Pick a column (e.g. user_id) and hash it to decide which real database instance a row lives on. Pick badly (e.g. a status field with 3 values) and one shard gets nearly everything.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Naive hashing (hash(key) % N) breaks the moment N changes</div>
          <div className="text-body text-xs leading-relaxed">Add or remove ONE real shard, and % N reassigns almost EVERY key to a different shard — a real, massive, unnecessary data migration.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">Consistent hashing fixes this</div>
          <div className="text-body text-xs leading-relaxed">Keys AND shards both map onto one hash ring. Adding or removing one shard only ever remaps the keys sitting right next to it on the ring — roughly 1/N of the data, not all of it.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">The real cost: cross-shard queries</div>
          <div className="text-body text-xs leading-relaxed">A query that needs rows from two different shards can&apos;t do one real JOIN anymore — it has to ask each shard separately and combine the results in application code (scatter-gather).</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Live-Coding a REST API Under Time Pressure",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "The Real Skill Being Tested Isn't Cleverness",
              description: "It's whether you can build a correctly-structured, working REST API fast, under a real clock, by reaching for patterns you've already drilled — not inventing anything new live.",
            },
            {
              label: "This Section's Mini-Project IS the Reference Solution",
              description: "A real Bookmarks API — create, list with cursor pagination, get one, delete — built exactly the way a real ~40-minute round should go, using the exact layering (routes/controllers) and validation (zod) already mastered in earlier topics.",
              example: "The live demo below runs the whole thing end to end against the real, running server.",
            },
            {
              label: "Narrate While You Type",
              description: "Real interviewers can't see your thinking — saying \"I'm using a cursor here instead of offset because it doesn't degrade at scale\" turns silent typing into real, demonstrated judgment.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          A live-coding round rewards speed that comes from genuine repetition, not improvisation. Every piece of
          this section&apos;s API — the routes/controllers split, zod validation, cursor pagination, real status
          codes — is a pattern already built and mastered elsewhere in this curriculum, just assembled fast.
        </Callout>
        <p>
          The demo below hits the real, running Bookmarks API: creates three real bookmarks, rejects one invalid one,
          pages through the real list with a real cursor, fetches one by id, 404s on a missing one, then deletes and
          confirms it&apos;s really gone.
        </p>
      </>
    ),
    extra: <TimeBudgetDiagram />,
    demo: <LiveCodingDrillRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/BackendSystemDesignDrills/LiveCodingDrill/routes/bookmarks.routes.js", note: "Every endpoint this resource has, at a glance — no logic, just path+method → controller." },
      { path: "examples/BackendSystemDesignDrills/LiveCodingDrill/controllers/bookmarks.controller.js", note: "The real logic — zod validation on create, and the real cursor-pagination filter (id > cursor)." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/BackendSystemDesignDrills/LiveCodingDrill"
        runCommand="node server.js"
        runPort={4118}
        steps={[
          {
            method: "POST",
            path: "/bookmarks",
            body: '{\n  "url": "https://nodejs.org",\n  "title": "Node.js Docs"\n}',
            note: "Do this one first — its real id (1) is used by later steps below.",
            expectStatus: 201,
            expectBody: '{"id":1,"url":"https://nodejs.org","title":"Node.js Docs","createdAt":"<a real ISO timestamp, whatever moment you send this>"}',
          },
          {
            method: "POST",
            path: "/bookmarks",
            body: '{\n  "url": "https://expressjs.com",\n  "title": "Express Docs"\n}',
            expectStatus: 201,
            expectBody: '{"id":2,"url":"https://expressjs.com","title":"Express Docs","createdAt":"<a real ISO timestamp>"}',
          },
          {
            method: "POST",
            path: "/bookmarks",
            body: '{\n  "url": "https://developer.mozilla.org",\n  "title": "MDN Web Docs"\n}',
            expectStatus: 201,
            expectBody: '{"id":3,"url":"https://developer.mozilla.org","title":"MDN Web Docs","createdAt":"<a real ISO timestamp>"}',
          },
          {
            method: "POST",
            path: "/bookmarks",
            body: '{\n  "url": "not-a-real-url",\n  "title": ""\n}',
            note: "A deliberately broken body — an invalid URL and an empty title.",
            expectStatus: 400,
            expectBody: '{"errors":{"url":["url must be a real, valid URL"],"title":["title is required"]}}',
          },
          {
            method: "GET",
            path: "/bookmarks?limit=2",
            expectStatus: 200,
            expectBody: '{"items":[{"id":1,"url":"https://nodejs.org","title":"Node.js Docs","createdAt":"<a real ISO timestamp>"},{"id":2,"url":"https://expressjs.com","title":"Express Docs","createdAt":"<a real ISO timestamp>"}],"nextCursor":2}',
          },
          {
            method: "GET",
            path: "/bookmarks?limit=2&cursor=2",
            note: "Reuse the real nextCursor (2) the previous step just returned.",
            expectStatus: 200,
            expectBody: '{"items":[{"id":3,"url":"https://developer.mozilla.org","title":"MDN Web Docs","createdAt":"<a real ISO timestamp>"}],"nextCursor":null}',
          },
          {
            method: "GET",
            path: "/bookmarks/1",
            expectStatus: 200,
            expectBody: '{"id":1,"url":"https://nodejs.org","title":"Node.js Docs","createdAt":"<a real ISO timestamp>"}',
          },
          {
            method: "GET",
            path: "/bookmarks/999",
            note: "An id that was never created.",
            expectStatus: 404,
            expectBody: '{"error":"No bookmark with id 999"}',
          },
          {
            method: "DELETE",
            path: "/bookmarks/1",
            expectStatus: 204,
            expectBody: "(no body)",
          },
          {
            method: "GET",
            path: "/bookmarks/1",
            note: "Confirms the delete really happened.",
            expectStatus: 404,
            expectBody: '{"error":"No bookmark with id 1"}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Discussion Anchors You've Already Built: Pagination, Idempotency & Rate Limiting",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "This Section Stays Conceptual — Deliberately",
              description: "Nothing new to build here. Pagination, idempotency keys, and rate limiting were already built, measured, and Postman-verified for real in \"REST Conventions & Validation\" and \"OWASP API Security & Rate Limiting.\" This section reframes them as interview talking points.",
            },
            {
              label: "Real System Design Interviews Reward Real Numbers, Not Definitions",
              description: "Saying \"cursor pagination is faster\" is a definition. Saying \"I measured cursor pagination at roughly 300x faster than offset on a 100,000-row Postgres table, because OFFSET forces the database to scan and discard every skipped row first\" is real, demonstrated experience.",
            },
            {
              label: "Each One Answers a Different Real Question",
              description: "Pagination: how do you list a lot of data efficiently. Idempotency: how do you make a write safe to retry. Rate limiting: how do you protect your API from being overwhelmed. Know which one a question is actually asking about.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          Three real, already-built, already-measured pieces of this curriculum ARE a system design interview
          answer, once you know to frame them that way — you don&apos;t need new material, you need the reframing.
        </Callout>
      </>
    ),
    extra: <InterviewAnchorsDiagram />,
  },
  {
    heading: "CAP Theorem, Mapped Onto Real Choices You Already Made",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "CAP Only Matters Once a System Genuinely Has More Than One Node",
              description: "A single Postgres server (as deployed for this project's own Stage C work — one real primary on Coolify) isn't actually a distributed system yet. CAP has nothing real to say about it until a second node — a replica — enters the picture.",
            },
            {
              label: "MongoDB Atlas, as Actually Connected in This Project, IS Already Distributed",
              description: "The real MongoDB Atlas cluster used throughout Stage C runs as a genuine replica set (multiple real nodes) right now — it has to make a real C-vs-A choice on every write, via its real writeConcern/readConcern settings.",
              example: "A write with writeConcern \"majority\" favors Consistency (waits for real nodes to agree). A read from a secondary with default settings can return slightly stale data — favoring Availability instead.",
            },
            {
              label: "This Reframes Stage C's Own Real SQL vs NoSQL Tradeoffs",
              description: "Postgres's single-primary, ACID-transaction model (proven with real rollback demos in \"Transactions & Query Performance\") is a strongly consistent design by construction. MongoDB's replica-set model gives you the real LEVER to choose — you can ask for strong consistency, or trade it for availability, request by request.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          CAP theorem isn&apos;t abstract trivia here — it&apos;s the honest, precise explanation for why this
          project&apos;s own real Postgres and real MongoDB choices behave differently under a real network problem,
          not just under normal conditions.
        </Callout>
      </>
    ),
    extra: <CapTheoremDiagram />,
  },
  {
    heading: "Sharding, Consistent Hashing & the Latency Numbers Every Engineer Should Know",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "Sharding Is What You Reach for When One Machine Genuinely Isn't Enough",
              description: "Splitting one huge table's rows across several real, separate database instances — each shard holds only PART of the data, so no single machine needs to hold all of it.",
            },
            {
              label: "The Shard Key Is the Real Design Decision, Not an Implementation Detail",
              description: "Pick a column with enough spread (user_id, not a 3-value status column) — a bad shard key sends most traffic to one \"hot\" shard, defeating the entire point of sharding.",
            },
            {
              label: "Consistent Hashing Is Why Adding a Shard Doesn't Reshuffle Everything",
              description: "Plain hash(key) % N remaps nearly every key when N changes. A hash ring only remaps the keys next to the one shard that actually changed — roughly 1/N of the data, a real, practical difference at scale.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          These stay framing-lens topics on purpose — real sharding needs multiple real database clusters, genuinely
          infra-team territory beyond this project&apos;s own scope. Knowing the shard-key tradeoff and the
          consistent-hashing insight, cold, is what a system design interview is actually checking for.
        </Callout>
      </>
    ),
    extra: (
      <>
        <ShardingDiagram />
        <LatencyNumbersDiagram />
      </>
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. A live-coding round tests whether real patterns you already own — the routes/controllers split,
        zod validation, cursor pagination, correct status codes — come out fast under a real clock, proven here by a
        genuine, running Bookmarks API. Pagination, idempotency keys, and rate limiting aren&apos;t new material
        either — they&apos;re already-built, already-measured pieces of this curriculum, reframed as system design
        talking points. CAP theorem stops being abstract once it&apos;s mapped onto this project&apos;s own real
        Postgres (single-node, strongly consistent by construction) and real MongoDB Atlas (an actual replica set,
        with a real lever between consistency and availability). And sharding/consistent hashing/the latency-numbers
        table round out the framing every senior candidate is expected to reach for — even when, like here, they
        stay talking points rather than something a solo Express app builds itself.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["clarify out loud", "skeleton (routes/controllers)", "status codes + validation", "one narrated edge case", "reframe what you already built"]} />
        <ComparisonCard
          tone="good"
          title="What to actually say in the room"
          points={[
            "\"I'd reach for cursor pagination — I measured it at ~300x faster than offset on a real 100k-row table.\"",
            "\"I'd add an idempotency key so a retried POST can't create a duplicate — the same pattern Stripe and PayPal use.\"",
            "\"CAP only bites once you're actually distributed — my Postgres here is single-node, but my MongoDB replica set already has to choose.\"",
            "\"I'd shard on user_id, not status — status only has a few values, so most traffic would hit one hot shard.\"",
          ]}
        />
      </>
    ),
  },
];

export default function BackendSystemDesignPage() {
  return (
    <StudyPage
      title="Backend System Design Drills"
      stageLabel="Stage F — Advanced & Interview Prep"
      stageColor="cyan"
      intro="A real, timed live-coding drill (a full Bookmarks API, built the way a real interview round expects), plus three already-built pieces of this curriculum — pagination, idempotency, rate limiting — reframed as system design talking points, and the framing lenses (CAP theorem, sharding, the latency-numbers table) that round out a senior-level answer."
      sections={sections}
    />
  );
}

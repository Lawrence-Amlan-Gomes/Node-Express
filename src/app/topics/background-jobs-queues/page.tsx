import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import WhyBackgroundJobsRunner from "@/example-runners/BackgroundJobsQueues/WhyBackgroundJobsRunner";
import BullMqProducerWorkerRunner from "@/example-runners/BackgroundJobsQueues/BullMqProducerWorkerRunner";
import JobRetriesBackoffRunner from "@/example-runners/BackgroundJobsQueues/JobRetriesBackoffRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function BlockingVsQueuedDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The SAME real 2-second task, two real ways to handle it</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Sync: the request IS the work</div>
          <div className="text-body text-xs leading-relaxed">The handler awaits the real slow task directly — the real HTTP response can&apos;t go out until it&apos;s genuinely done, roughly 2 real seconds later.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">Async: the request just WRITES a real job into Redis</div>
          <div className="text-body text-xs leading-relaxed">That write is fast — milliseconds, not seconds — so the real response goes out almost immediately. The slow work still happens, just later, in a real worker.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">This section&apos;s demo measures the real response-time gap directly — the same real work, ~600x faster to respond to.</span>
      </div>
    </div>
  );
}

function ProducerWorkerDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Redis is the real, shared handoff point between two separate real processes</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">Producer (server.js) — an ordinary Express app</div>
          <div className="text-body text-xs leading-relaxed">A real route handler calls <code>queue.add(...)</code>, which writes a real job into Redis and returns — it has no idea which process will pick it up, or when.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Redis — the real, durable middle layer</div>
          <div className="text-body text-xs leading-relaxed">The job survives here even if the producer process restarts — it&apos;s real, persisted data, not something held in either process&apos;s own memory.</div>
        </div>
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">Worker (worker.js) — a genuinely SEPARATE real OS process</div>
          <div className="text-body text-xs leading-relaxed">Never imported by the producer at all. This section&apos;s demo spawns it as its own real process and proves — from ITS OWN separate stdout — that it did the real work.</div>
        </div>
      </div>
    </div>
  );
}

function RetryBackoffDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">3 real attempts, a real fixed 500ms wait between each failure</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Attempt 1 fails → real state becomes &quot;delayed&quot;</div>
          <div className="text-body text-xs leading-relaxed">BullMQ catches the real thrown error itself — nothing in the route handler has to catch or retry anything by hand.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Attempt 2 fails → delayed again, real attemptsMade now 2</div>
          <div className="text-body text-xs leading-relaxed">Every real attempt is tracked on the job itself — a real client can poll and see exactly how many tries have happened so far.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">Attempt 3 succeeds → real state becomes &quot;completed&quot;</div>
          <div className="text-body text-xs leading-relaxed">This section&apos;s demo measures the real total wait — genuinely slower than instant, since it really includes 2 real 500ms backoff delays.</div>
        </div>
      </div>
    </div>
  );
}

function QueueVsBrokerDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two genuinely different real jobs, not two names for the same tool</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">BullMQ + Redis: work WITHIN your own app</div>
          <div className="text-body text-xs leading-relaxed">One real app enqueues, your own worker code processes — every real example on this page. Right tool for &quot;do this slow thing later, not right now.&quot;</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">RabbitMQ: routing real messages BETWEEN different services</div>
          <div className="text-body text-xs leading-relaxed">A real message broker with routing rules (exchanges, bindings) — built for one service to reliably hand work to a DIFFERENT service it doesn&apos;t control.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Kafka: a real, durable, replayable LOG of events</div>
          <div className="text-body text-xs leading-relaxed">Built for many real services to independently read the SAME event stream, at their own pace, including services that didn&apos;t exist yet when the event was written.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Why Background Jobs? Not Every Request Should Block",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "A Real Request Doesn't Have to Wait for Everything It Triggers",
              description: "Think of a restaurant: the waiter takes your order and walks away immediately — they don't stand at your table until the food is cooked. A real HTTP request can work the same way.",
            },
            {
              label: "The Real Problem: Slow Work Inside a Request Handler",
              description: "Sending a real email, generating a real report, resizing a real image — none of these need to finish before the CLIENT gets a response. Making them synchronous just makes every caller wait for no real reason.",
            },
            {
              label: "The Fix: Write a Real Job, Respond Immediately, Do the Work Later",
              description: "The route handler writes a small real job into a real queue (backed by Redis) and returns right away. A separate real worker picks that job up and does the actual slow work, on its own time.",
              example: "This section's demo measures both paths on the SAME real 2-second task — a real, direct, before/after comparison.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          If the client doesn&apos;t need the RESULT of some work before their response can go out, that work doesn&apos;t
          belong inside the request at all.
        </Callout>
        <p>
          The demo below runs the identical real 2-second task two ways — awaited directly, then enqueued instead —
          and measures the real response-time gap between them.
        </p>
      </>
    ),
    extra: <BlockingVsQueuedDiagram />,
    demo: <WhyBackgroundJobsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/BackgroundJobsQueues/WhyBackgroundJobs/queues/report.queue.js", note: "A real BullMQ Queue (for adding jobs) and Worker (for processing them) backed by this machine's real local Redis." },
      { path: "examples/BackgroundJobsQueues/WhyBackgroundJobs/controllers/report.controller.js", note: "The sync route awaits the real slow task directly; the async route enqueues it and returns immediately." },
      { path: "examples/BackgroundJobsQueues/WhyBackgroundJobs/demo.js", note: "Times both real routes, then polls the real job until the worker actually finishes it." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/BackgroundJobsQueues/WhyBackgroundJobs"
        runCommand="node server.js"
        runPort={4107}
        steps={[
          {
            method: "POST",
            path: "/reports/sync",
            note: "Blocks for the real slow task before responding.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"tookMs":<a real number close to 2000>,"mode":"sync"}',
          },
          {
            method: "POST",
            path: "/reports/async",
            note: "Enqueues the real job and responds immediately. Your response will show the real jobId to use below.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"tookMs":<a real number close to 0>,"mode":"async","jobId":<a real id, "1" on a fresh server>}',
          },
          {
            method: "GET",
            path: "/reports/1/status",
            note: "Send this right after the async call above — the real worker probably hasn't finished yet.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"id":"1","state":"active" (or "waiting"),"returnValue":null}',
          },
          {
            method: "GET",
            path: "/reports/1/status",
            note: "Send it again about 2 real seconds later.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"id":"1","state":"completed","returnValue":{"generatedAt":<a real timestamp>}}',
          },
        ]}
      />
    ),
  },
  {
    heading: "BullMQ: Producers, Workers & Real Queue Mechanics",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "The Previous Section Cheated a Little, on Purpose",
              description: "Its worker ran in the SAME process as the producer, to keep the response-time comparison simple. A real production setup almost always splits them into genuinely separate processes.",
            },
            {
              label: "The Producer Only Ever Writes to Redis",
              description: "A real Express route calls queue.add(...) and is done — it has no idea whether a worker is even running right now. The job just waits in Redis until one is.",
            },
            {
              label: "The Worker Is a Real, Separate, Standalone Script",
              description: "Run on its own (node worker.js), never imported by the producer. In production this is usually a completely separate deployment — its own container, its own scaling, restarted independently of the API.",
              example: "This section's demo spawns worker.js as a genuinely separate real OS process and proves it did the work, using ITS OWN separate real stdout as evidence.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          Redis is the real, durable handoff point. The producer and the worker never talk to each other directly —
          they only ever talk to Redis, which is what lets them scale, deploy, and restart completely independently.
        </Callout>
        <p>
          The demo below starts a real, separate worker process, queues 3 real jobs from the producer, and polls each
          one until that OTHER real process reports it done.
        </p>
      </>
    ),
    extra: <ProducerWorkerDiagram />,
    demo: <BullMqProducerWorkerRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/BackgroundJobsQueues/BullMqProducerWorker/queues/connection.js", note: "The one real queue name + Redis connection both the producer and the separate worker have to agree on." },
      { path: "examples/BackgroundJobsQueues/BullMqProducerWorker/worker.js", note: "A real, standalone script — never imported by server.js. Run it on its own with node worker.js." },
      { path: "examples/BackgroundJobsQueues/BullMqProducerWorker/demo.js", note: "Spawns worker.js as a genuinely separate real process, then proves it processed the real jobs." },
    ],
    postmanCheck: (
      <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
          <span className="text-title text-sm font-semibold">Try It Yourself in Postman — Needs TWO Real Terminals</span>
        </div>
        <div className="text-body text-xs leading-relaxed mb-3">
          This section is the one place on this page where a single <code>runCommand</code> genuinely isn&apos;t enough —
          the whole point is a real, separate worker process, so it needs its own real terminal too.
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal A — the producer</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">
              cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/BackgroundJobsQueues/BullMqProducerWorker&quot; &amp;&amp; node server.js
            </code>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. Terminal B — the real, separate worker</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">
              cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/BackgroundJobsQueues/BullMqProducerWorker&quot; &amp;&amp; node worker.js
            </code>
            <div className="mt-1.5 text-xs text-body leading-relaxed">Leave both running — watch Terminal B while you send the requests below.</div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3.1. In Postman: POST http://localhost:4108/jobs/welcome-email</div>
            <div className="text-xs text-body leading-relaxed mb-1">Body (raw JSON): <code className="text-cyan-500">{'{"email":"you@example.com"}'}</code></div>
            <div className="text-xs text-body leading-relaxed">
              Expect: <span className="text-green-500 font-mono">202</span>{" "}
              <span className="font-mono">{'{"jobId":<a real id>,"queuedFor":"you@example.com"}'}</span> — and watch Terminal B print
              a real &quot;picked up job&quot; line within about half a second.
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3.2. GET http://localhost:4108/jobs/welcome-email/&lt;the real jobId from 3.1&gt;/status</div>
            <div className="text-xs text-body leading-relaxed">
              Expect: <span className="text-green-500 font-mono">200</span>{" "}
              <span className="font-mono">{'{"state":"completed","returnValue":{"sentTo":"you@example.com","sentAt":<a real timestamp>}}'}</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    heading: "Job Retries & Backoff",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "Real Work Sometimes Fails, for Reasons Outside Your Control",
              description: "A third-party API times out, a network blip drops a request — a real production worker has to expect this, not just hope it never happens.",
            },
            {
              label: "attempts + backoff: Real Retry Rules, Configured, Not Hand-Written",
              description: "Pass { attempts: 3, backoff: { type: \"fixed\", delay: 500 } } when adding a job, and BullMQ handles catching the real error, waiting, and re-running it — no try/catch retry loop to write yourself.",
              example: "This section's demo deliberately fails a real job's first 2 attempts, then lets it succeed on the 3rd — proving the real retry actually ran, not just describing it.",
            },
            {
              label: "Every Real Attempt Is Tracked on the Job Itself",
              description: "job.attemptsMade and job.failedReason are real, live fields a client can poll — you can show a real user \"retrying (attempt 2 of 3)\" instead of just a spinner.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          Retries turn a real, transient failure into an eventual real success automatically — but only within limits
          you set. A job that fails 3 real times still genuinely fails; retries buy resilience, not a guarantee.
        </Callout>
        <p>
          The demo below queues a real job engineered to fail its first two real attempts, polls its real state as
          BullMQ retries it with a real 500ms backoff, and measures the real total time until it succeeds.
        </p>
      </>
    ),
    extra: <RetryBackoffDiagram />,
    demo: <JobRetriesBackoffRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/BackgroundJobsQueues/JobRetriesBackoff/queues/task.queue.js", note: "The processor deliberately throws on job.attemptsMade < 2 — a real, verified failure, not a fabricated one." },
      { path: "examples/BackgroundJobsQueues/JobRetriesBackoff/controllers/task.controller.js", note: "Real retry config on queue.add(), and a status endpoint exposing the real attemptsMade/failedReason." },
      { path: "examples/BackgroundJobsQueues/JobRetriesBackoff/demo.js", note: "Polls the real job through delayed → delayed → completed and measures the real total wait." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/BackgroundJobsQueues/JobRetriesBackoff"
        runCommand="node server.js"
        runPort={4109}
        steps={[
          {
            method: "POST",
            path: "/jobs/flaky-task",
            note: "On a fresh server, the real jobId will be \"1\".",
            expectStatus: 202,
            expectBody: 'A real JSON object: {"jobId":"1"}',
          },
          {
            method: "GET",
            path: "/jobs/flaky-task/1/status",
            note: "Send this a few times quickly, right after the POST above.",
            expectStatus: 200,
            expectBody: 'A real JSON object showing it retrying: {"id":"1","state":"delayed","attemptsMade":1,"failedReason":"Deliberate real failure on attempt 1","returnValue":null} — attemptsMade climbs to 2 on the next real failure.',
          },
          {
            method: "GET",
            path: "/jobs/flaky-task/1/status",
            note: "Send it again about 1.5 real seconds after the original POST.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"id":"1","state":"completed","attemptsMade":3,"failedReason":"Deliberate real failure on attempt 2","returnValue":{"succeededOnAttempt":3}}',
          },
        ]}
      />
    ),
  },
  {
    heading: "BullMQ vs RabbitMQ vs Kafka",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "This Section Stays Conceptual — Deliberately",
              description: "RabbitMQ and Kafka solve real problems bigger than a solo backend project's own infrastructure — installing either here would be a real infra lift for a comparison that's more valuable understood than half-built.",
            },
            {
              label: "BullMQ: One App, Talking to Itself Over Time",
              description: "Everything on this page so far — a real app enqueues work for its OWN later processing, using Redis it already has for caching. No other service is involved.",
            },
            {
              label: "RabbitMQ: a Real Message Broker BETWEEN Services",
              description: "Built for one service to reliably hand a real message to a genuinely different service — with real routing rules (exchanges, bindings) deciding which consumer gets what.",
            },
            {
              label: "Kafka: a Real, Durable, Replayable Log of Events",
              description: "Not really a \"queue\" at all — a real ordered log multiple independent services can each read at their own pace, including services that didn't exist yet when the event was originally written.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          &quot;Bigger queue&quot; is the wrong mental model for RabbitMQ and Kafka. They solve cross-service communication
          and event history — genuinely different problems from BullMQ&apos;s &quot;do this later, in my own app.&quot;
        </Callout>
      </>
    ),
    extra: <QueueVsBrokerDiagram />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Background jobs exist because a real HTTP response shouldn&apos;t have to wait for work the client
        doesn&apos;t need the result of yet — measured here as a real ~600x faster response for the identical task, just
        enqueued instead of awaited. BullMQ&apos;s real architecture is a producer (writes jobs to Redis) and a worker
        (reads and processes them) that never talk to each other directly — only through Redis — which is exactly what
        lets them deploy, scale, and restart independently, proven here with a genuinely separate real worker process.
        Retries (attempts + backoff) turn real, transient failures into eventual real successes automatically, with
        every attempt tracked on the job itself for a client to poll. And the broader landscape: BullMQ is for one
        app&apos;s own delayed work; RabbitMQ routes real messages between different services; Kafka is a real, durable,
        replayable event log multiple services can read independently — three genuinely different tools, not three
        names for the same idea.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["route handler enqueues a real job", "responds immediately", "a real worker picks it up (maybe a separate process)", "retries on real failure, with backoff", "BullMQ (in-app) vs RabbitMQ (cross-service) vs Kafka (event log)"]} />
        <ComparisonCard
          tone="good"
          title="Which one, when — the real decision"
          points={[
            "Need to do something slow AFTER responding to a request, inside your own app? BullMQ + Redis — you probably already have Redis for caching.",
            "Need one service to reliably hand work to a DIFFERENT service, with routing logic deciding who gets what? RabbitMQ.",
            "Need multiple independent services to each read the same stream of events, at their own pace, possibly re-reading history? Kafka.",
            "All three let a slow real task run outside the request that triggered it — the real difference is WHO's on the other end: your own worker, a different service, or many independent readers.",
          ]}
        />
      </>
    ),
  },
];

export default function BackgroundJobsQueuesPage() {
  return (
    <StudyPage
      title="Background Jobs & Message Queues"
      stageLabel="Stage F — Advanced & Interview Prep"
      stageColor="cyan"
      intro="Real BullMQ + Redis background job processing — why requests shouldn't block on slow work, the real producer/worker split across separate processes, and real automatic retries with backoff — plus where RabbitMQ and Kafka actually fit, a genuinely different problem."
      sections={sections}
    />
  );
}

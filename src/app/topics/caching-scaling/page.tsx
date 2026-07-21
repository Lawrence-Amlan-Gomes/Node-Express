import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import CacheAsideRunner from "@/example-runners/CachingScaling/CacheAsideRunner";
import CacheInvalidationRunner from "@/example-runners/CachingScaling/CacheInvalidationRunner";
import CacheStampedeRunner from "@/example-runners/CachingScaling/CacheStampedeRunner";
import DistributedLockRunner from "@/example-runners/CachingScaling/DistributedLockRunner";
import ClusterHttpRunner from "@/example-runners/CachingScaling/ClusterHttpRunner";
import WorkerThreadsCpuRunner from "@/example-runners/CachingScaling/WorkerThreadsCpuRunner";
import PM2ProcessManagementRunner from "@/example-runners/CachingScaling/PM2ProcessManagementRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function CacheAsideDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Cache-aside — Redis sits BESIDE the real data, checked first</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">1. Real cache MISS</div>
          <div className="text-body text-xs leading-relaxed">Redis has nothing for this key yet. The real, slower source gets queried — this section&apos;s demo simulates a real 300ms database round trip.</div>
        </div>
        <div className="rounded-card border border-yellow-500/40 bg-yellow-500/3 px-3 py-2">
          <div className="font-mono text-xs text-yellow-500 font-semibold mb-0.5">2. Store the real result in Redis, with a real expiry</div>
          <div className="text-body text-xs leading-relaxed">A real TTL (30 real seconds here) means a stale value can&apos;t live forever, even if nothing ever explicitly invalidates it.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">3. Real cache HIT, every request after that</div>
          <div className="text-body text-xs leading-relaxed">Redis answers directly — this section&apos;s demo measures this at roughly 300x faster than the real slow path, for the identical data.</div>
        </div>
      </div>
    </div>
  );
}

function CacheInvalidationDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A write has to touch BOTH real places — the source of truth AND the cache</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Without this fix</div>
          <div className="text-body text-xs leading-relaxed">A real PUT updates the real database, but the real Redis entry for that same id just sits there, unchanged, until its TTL eventually expires — every read in between returns a real, genuinely stale value.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">With this fix</div>
          <div className="text-body text-xs leading-relaxed">The SAME real request that updates the database also deletes the real cache entry, in the same handler — the very next read is a real, honest cache miss that fetches the real new value.</div>
        </div>
      </div>
    </div>
  );
}

function CacheStampedeDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">10 real concurrent requests, one cold cache key — what actually happens</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Unprotected: all 10 see a real miss, all 10 compute</div>
          <div className="text-body text-xs leading-relaxed">Cache-aside alone only protects AFTER the first result is stored. Nothing stops 10 real requests that all arrive before that happens from all doing the real expensive work themselves.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">Protected: the FIRST real request computes, the other 9 wait for it</div>
          <div className="text-body text-xs leading-relaxed">A real in-process &quot;single-flight&quot; map remembers a computation already in progress for this key — every other concurrent request just awaits that SAME real Promise instead of starting its own.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Real measured result: 10 real computations, unprotected — 1 real computation, protected. Same 10 requests, same cold cache.</span>
      </div>
    </div>
  );
}

function DistributedLockDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">SET key value NX PX ttl — one real, atomic command IS the whole lock</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">NX — only set if this key does NOT already exist</div>
          <div className="text-body text-xs leading-relaxed">If two real workers race to SET the same key at the same real moment, Redis (a real, single-threaded command processor) guarantees only ONE of them actually succeeds.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">PX — a real expiry, in milliseconds</div>
          <div className="text-body text-xs leading-relaxed">If the real worker holding the lock crashes before releasing it, the lock still disappears on its own — it can never get stuck forever.</div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">The safe release: a real Lua script, not a plain DEL</div>
          <div className="text-body text-xs leading-relaxed">Checks the stored value really is THIS worker&apos;s own id before deleting — run as ONE atomic Redis-side operation, so no other real process can slip in between the check and the delete.</div>
        </div>
      </div>
    </div>
  );
}

function ClusterDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real port, several real, separate OS processes sharing it</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-cyan-500/40 bg-cyan-500/3 px-3 py-2">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-0.5">The real primary process forks real worker processes</div>
          <div className="text-body text-xs leading-relaxed">Each real worker is a genuinely separate OS process, running the SAME Express app, all sharing the one real port the primary manages.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Process-based means real fault isolation</div>
          <div className="text-body text-xs leading-relaxed">If one real worker crashes, ONLY that process dies — the others keep answering real requests the whole time, and the primary forks a real replacement.</div>
        </div>
      </div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 mt-3 text-center">
        <span className="text-body text-xs">The right tool for I/O-bound HTTP load — more real processes means more concurrent real requests handled, each fully isolated from the others.</span>
      </div>
    </div>
  );
}

function WorkerThreadsDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">worker_threads — real, GENUINELY SHARED memory, not separate processes</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-orange-500/40 bg-orange-500/3 px-3 py-2">
          <div className="font-mono text-xs text-orange-500 font-semibold mb-0.5">A real SharedArrayBuffer — every thread writes into the SAME memory</div>
          <div className="text-body text-xs leading-relaxed">Unlike cluster&apos;s separate processes (which can only talk by passing messages), real threads can read and write the exact same real block of memory, using Atomics for safety.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">The right tool for CPU-BOUND work, not I/O-bound HTTP load</div>
          <div className="text-body text-xs leading-relaxed">Splitting one real, expensive computation (counting real primes) across real threads that share this machine&apos;s real CPU cores — not about handling more concurrent requests.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Real measured result on this machine&apos;s 8 real cores: the identical real prime count, computed several times faster.</span>
      </div>
    </div>
  );
}

function ClusterVsWorkerThreadsCard() {
  return (
    <ComparisonCard
      tone="good"
      title="cluster vs worker_threads — the real, clean distinction"
      points={[
        "cluster: multiple real, separate OS PROCESSES, sharing one port. Right tool for I/O-bound HTTP load — more concurrent requests handled, each process fully fault-isolated from the others.",
        "worker_threads: multiple real THREADS inside ONE process, with genuinely shared memory (SharedArrayBuffer + Atomics). Right tool for CPU-bound work — splitting one expensive computation across real CPU cores.",
        "A crashed cluster worker only takes itself down — the primary forks a real replacement. A crashed worker_thread can take the WHOLE process down if unhandled, since it shares that process's memory.",
      ]}
    />
  );
}

function TryClusterYourself() {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — In Your Own Terminal</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        The demo above runs this exact same server as a real spawned process. Here&apos;s the same real thing, but with you
        sending the requests by hand.
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">
            cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/CachingScaling/ClusterHttp&quot; &amp;&amp; node server.js
          </code>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. In Postman, GET http://localhost:4101/ a few times in a row</div>
          <div className="text-xs text-body leading-relaxed">
            Watch the real <code className="text-cyan-500">pid</code> in the response change between requests — real, different
            OS processes are answering, round-robin.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. GET http://localhost:4101/crash-me once</div>
          <div className="text-xs text-body leading-relaxed">
            That one real worker really exits. Send GET / a few more times — every request still succeeds, and the
            primary&apos;s own terminal log shows it forking a real replacement.
          </div>
        </div>
      </div>
    </div>
  );
}

function Pm2LoadBalancerDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">PM2&apos;s built-in cluster mode IS a real, working load balancer</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">pm2 start app.js -i 4</div>
          <div className="text-body text-xs leading-relaxed">Starts 4 real instances, using the SAME cluster module mechanics from the previous section, all sharing one real port — PM2 is managing the real process pool for you.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">A dedicated load balancer (Nginx, HAProxy, a cloud LB) does the same job, one level up</div>
          <div className="text-body text-xs leading-relaxed">Instead of balancing across processes on ONE machine, it balances across several real, separate SERVERS — same real idea (distribute requests, detect a dead target, route around it), bigger scale.</div>
        </div>
      </div>
    </div>
  );
}

function TryPm2Yourself() {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — In Your Own Terminal</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        The demo above drives these exact real pm2 commands already. Here they are for you to run and watch directly.
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">
            cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/CachingScaling/PM2ProcessManagement&quot; &amp;&amp; ./node_modules/.bin/pm2 start server.js --name my-demo
          </code>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. Watch it live</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">./node_modules/.bin/pm2 list</code>
          <div className="mt-1.5 text-xs text-body leading-relaxed">Shows the real pid, real uptime, and real restart_time (starts at 0).</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. Simulate a real crash</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">kill -9 &lt;the real pid from step 2&gt;</code>
          <div className="mt-1.5 text-xs text-body leading-relaxed">
            Run <code className="text-cyan-500">pm2 list</code> again — a real NEW pid, and restart_time is now 1. Clean up with{" "}
            <code className="text-cyan-500">./node_modules/.bin/pm2 delete my-demo</code>.
          </div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "The Cache-Aside Pattern",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "The Real Problem: the Same Slow Question, Asked Over and Over",
              description: "A real database query, or a real external API call, costs real time — often hundreds of milliseconds. If the SAME question gets asked again a second later, redoing all that real work is pure waste.",
            },
            {
              label: "Redis Sits BESIDE the Real Data, Checked FIRST",
              description: "\"Cache-aside\" means your own code checks Redis before touching the real slow source — Redis never automatically knows about your database at all. Your code is what wires the two together.",
            },
            {
              label: "The Real Pattern, in Three Steps",
              description: "Check Redis. Cache MISS? Do the real slow work, then store the real result in Redis with a real expiry. Cache HIT? Skip the slow work entirely and answer straight from Redis.",
              example: "This section's demo measures a real ~300x speed-up on the second identical request — the same real data, answered almost instantly.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          Redis never knows anything on its own — YOUR code decides what gets cached, for how long, and when to check
          it. That&apos;s the entire &quot;cache-aside&quot; idea in one sentence.
        </Callout>
        <p>
          The demo below requests the same real product twice — a real cache MISS (slow, hits the simulated database)
          followed by a real cache HIT (fast, straight from Redis) — and measures the real speed difference.
        </p>
      </>
    ),
    extra: <CacheAsideDiagram />,
    demo: <CacheAsideRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CachingScaling/CacheAside/redisClient.js", note: "The only file that talks to Redis directly — same one-file-owns-the-client pattern as this project's Prisma/Mongoose/S3 controllers." },
      { path: "examples/CachingScaling/CacheAside/controllers/product.controller.js", note: "The real cache-aside logic: check Redis, fall back to a real simulated slow fetch, store the real result with a real TTL." },
      { path: "examples/CachingScaling/CacheAside/demo.js", note: "Requests the same real product twice and measures the real cache-hit speed-up." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/CachingScaling/CacheAside"
        runCommand="node server.js"
        runPort={4097}
        steps={[
          {
            method: "GET",
            path: "/product/42",
            note: "First call on a freshly started server — a real cache miss.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"id":"42","name":"Mechanical Keyboard","price":89,"source":"database","tookMs":<roughly 300>}',
          },
          {
            method: "GET",
            path: "/product/42",
            note: "Same request again — a real cache hit.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"id":"42","name":"Mechanical Keyboard","price":89,"source":"cache","tookMs":<a real number close to 0>}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Cache Invalidation",
    body: (
      <>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "Caching a Value Means It Can Go Stale",
              description: "The moment the real source of truth changes, the cached copy is now WRONG — until its TTL eventually expires, or something deliberately tells Redis to forget it.",
            },
            {
              label: "\"There Are Only Two Hard Things in Computer Science...\"",
              description: "Cache invalidation is famously one of them — not because deleting a key is technically hard, but because it's easy to forget a write path that should have invalidated something and didn't.",
            },
            {
              label: "The Real Fix: the SAME Write That Changes the Data Also Deletes the Cache",
              description: "Right inside the same PUT/PATCH handler that updates the real database — never left as a separate step, a background job, or something to remember later.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="yellow">
          A cache with no invalidation path isn&apos;t really a cache — it&apos;s a countdown timer to serving wrong
          data. Every write path that touches cached data needs to own clearing it too.
        </Callout>
        <p>
          The demo below reads a real product (cache miss, then cache hit, same old price), updates its real price,
          and reads it again — proving the read right after the update returns the real NEW price, not a stale cached
          one.
        </p>
      </>
    ),
    extra: <CacheInvalidationDiagram />,
    demo: <CacheInvalidationRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CachingScaling/CacheInvalidation/controllers/product.controller.js", note: "getProduct does cache-aside; updateProduct updates the real source of truth AND deletes the real cache entry, in the same handler." },
      { path: "examples/CachingScaling/CacheInvalidation/demo.js", note: "GET, GET, PUT, GET — proves the cache never serves the old price after the real update." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/CachingScaling/CacheInvalidation"
        runCommand="node server.js"
        runPort={4098}
        steps={[
          {
            method: "GET",
            path: "/product/42",
            expectStatus: 200,
            expectBody: '{"id":"42","price":89,"source":"database"}',
          },
          {
            method: "GET",
            path: "/product/42",
            expectStatus: 200,
            expectBody: '{"id":"42","price":89,"source":"cache"}',
          },
          {
            method: "PUT",
            path: "/product/42",
            body: '{"price":120}',
            expectStatus: 200,
            expectBody: '{"id":"42","price":120,"invalidated":true}',
          },
          {
            method: "GET",
            path: "/product/42",
            note: "Right after the update — a real cache miss again, but now with the real NEW price.",
            expectStatus: 200,
            expectBody: '{"id":"42","price":120,"source":"database"}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Cache Stampede: Single-Flight Protection",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "The Real Problem Cache-Aside Alone Doesn't Solve",
              description: "Cache-aside protects requests AFTER a result is stored. It says nothing about what happens when 10, 100, or 1000 real requests for the SAME cold key all arrive before any of them finishes computing.",
            },
            {
              label: "A Cache Stampede: Every One of Them Sees a Miss",
              description: "Every single concurrent request checks Redis, finds nothing, and starts the real expensive work itself — the exact real work the cache was supposed to prevent, done N times instead of once.",
            },
            {
              label: "The Fix: Single-Flight — the First Request Computes, Everyone Else Waits",
              description: "A real in-process map remembers a computation already running for a given key. Any OTHER concurrent request for that same key just awaits the SAME real Promise instead of starting a new one.",
              example: "This section's demo fires 10 real concurrent requests at a cold key: 10 real computations unprotected, 1 real computation protected.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          A cache is only as good as its worst moment — the instant it&apos;s empty. Single-flight is what keeps that one
          moment from turning into N times the real load on your actual data source.
        </Callout>
        <p>
          The demo below fires 10 real concurrent requests at a cold, unprotected cache key, then 10 more at a cold,
          protected one — and counts exactly how many times the real expensive computation actually ran, for each.
        </p>
      </>
    ),
    extra: <CacheStampedeDiagram />,
    demo: <CacheStampedeRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CachingScaling/CacheStampede/controllers/report.controller.js", note: "The unprotected route right next to the protected one — the only difference is the real in-process single-flight map." },
      { path: "examples/CachingScaling/CacheStampede/demo.js", note: "Fires 10 real concurrent requests at each route and counts real computations via Promise.all." },
    ],
  },
  {
    heading: "A Real Distributed Lock with Redis",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "Single-Flight Only Works Within ONE Process",
              description: "The in-process map from the last section only sees requests hitting THAT one real process. A real production app usually runs several instances — each with its own separate memory, its own separate map.",
            },
            {
              label: "The Real Problem: Preventing DOUBLE-Processing Across Instances",
              description: "A scheduled job (\"send the daily report\") triggered on every instance at once would otherwise really run once per instance — the same real email sent multiple times, the same real charge processed twice.",
            },
            {
              label: "SET key value NX PX ttl — a Real, Atomic Lock, Shared Across Every Instance",
              description: "Since every instance talks to the SAME real Redis, this one real atomic command is enough to guarantee only ONE instance ever \"wins\" the lock — no matter how many instances race for it at the same real moment.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          A distributed lock is just cache-aside&apos;s single-flight idea, moved from one process&apos;s memory into a real,
          shared place every instance can see — which is exactly what Redis already is.
        </Callout>
        <p>
          The demo below has two real &quot;workers&quot; race to acquire the SAME lock key at the same real moment —
          exactly one wins — then proves the safe release only works for the real owner, and that the lock never gets
          stuck forever.
        </p>
      </>
    ),
    extra: <DistributedLockDiagram />,
    demo: <DistributedLockRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CachingScaling/DistributedLock/lock.js", note: "acquireLock (real SET NX PX) and the safe releaseLock (a real Lua script checking ownership before deleting)." },
      { path: "examples/CachingScaling/DistributedLock/demo.js", note: "Two real workers race for the same lock, a wrong-owner release is refused, then a correct release and re-acquire." },
    ],
  },
  {
    heading: "The cluster Module: Process-Based Scaling",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "One Node Process Can Only Use One Real CPU Core",
              description: "Node's own JavaScript execution is single-threaded — a plain `node server.js` never uses more than one real core, no matter how many cores this machine actually has.",
            },
            {
              label: "cluster: Fork Several Real, Separate OS Processes",
              description: "Node's built-in cluster module forks several REAL, separate processes, all running the same app, all sharing ONE real port — the OS (via the primary process) distributes incoming connections between them.",
            },
            {
              label: "Real Fault Isolation, Not Just Speed",
              description: "Because each worker is a genuinely separate OS process, one crashing doesn't touch the others at all — and the primary can fork a real replacement automatically.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          cluster&apos;s real value isn&apos;t just handling more requests — it&apos;s that a crash in one real worker can
          NEVER take down the whole app, which a single Node process alone could never promise.
        </Callout>
        <p>
          The demo below forks 3 real worker processes sharing one port, fires several real requests to show
          different real PIDs answering, then makes one real worker genuinely crash — proving every subsequent
          request still succeeds.
        </p>
      </>
    ),
    extra: <ClusterDiagram />,
    demo: <ClusterHttpRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CachingScaling/ClusterHttp/server.js", note: "cluster.isPrimary forks 3 real workers; the real 'exit' handler forks a replacement whenever any worker really dies." },
      { path: "examples/CachingScaling/ClusterHttp/controllers/status.controller.js", note: "Every response reports its own real process.pid — the only way to prove multiple real processes share this port." },
      { path: "examples/CachingScaling/ClusterHttp/demo.js", note: "Collects real distinct worker PIDs, triggers a real crash, and proves the pool keeps answering requests." },
    ],
    postmanCheck: <TryClusterYourself />,
  },
  {
    heading: "worker_threads: Shared-Memory Parallelism for CPU-Bound Work",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "cluster Solves a Different Problem Than This One",
              description: "cluster is about handling more concurrent HTTP requests — it doesn't make any SINGLE request finish its own work any faster.",
            },
            {
              label: "worker_threads: Split ONE Expensive Computation Across Real Threads",
              description: "Real threads inside the SAME process, each running a real chunk of the same CPU-bound work in parallel, using this machine's real, multiple CPU cores.",
            },
            {
              label: "The Real Difference From cluster: GENUINELY Shared Memory",
              description: "A real SharedArrayBuffer is one block of memory every thread can read and write directly — no message-passing needed, using Atomics to do it safely.",
              example: "This section's demo: each real thread writes its own real prime count into one shared buffer, at its own slot.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          Reach for cluster when the problem is &quot;too many requests for one process.&quot; Reach for
          worker_threads when the problem is &quot;this ONE piece of work is too slow for one core.&quot;
        </Callout>
        <p>
          The demo below counts real prime numbers below 8 million — once single-threaded, once split across this
          real machine&apos;s real CPU cores using worker_threads — and confirms both real counts match exactly
          before comparing the real measured speed-up.
        </p>
      </>
    ),
    extra: <WorkerThreadsDiagram />,
    demo: <WorkerThreadsCpuRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CachingScaling/WorkerThreadsCpu/isPrime.js", note: "The real, deliberately naive CPU-bound work — trial-division primality checking." },
      { path: "examples/CachingScaling/WorkerThreadsCpu/prime-worker.js", note: "Each real worker thread computes its own chunk and writes the real result into one shared SharedArrayBuffer, via Atomics." },
      { path: "examples/CachingScaling/WorkerThreadsCpu/demo.js", note: "Runs the same real work single-threaded, then multi-threaded, and compares real timings." },
    ],
  },
  {
    heading: "PM2: Process Management & Built-In Load Balancing",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "cluster Is a Real Building Block — PM2 Is the Real Tool Built On Top Of It",
              description: "Everything from the cluster section (fork real workers, restart on crash) is exactly what a real production process manager needs — PM2 packages that up with real monitoring, logs, and a simple CLI.",
            },
            {
              label: "Real Auto-Restart, Zero Code Required",
              description: "PM2 watches every real process it manages. If one really crashes, PM2 restarts it automatically — no cluster.on('exit', ...) handler to write yourself.",
            },
            {
              label: "pm2 start app.js -i 4 IS a Real, Working Load Balancer",
              description: "The exact same cluster mechanics from two sections ago, driven by one real PM2 command — 4 real processes sharing one port, PM2 balancing real requests across them.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          PM2 doesn&apos;t replace cluster — it&apos;s a real, production-grade process manager built on the same real
          idea, so you don&apos;t have to hand-write the fault-tolerance logic yourself.
        </Callout>
        <p>
          The demo below starts a real app under PM2, confirms it&apos;s really answering requests, force-kills its
          real OS process to simulate a crash, and proves PM2 detected it and restarted it on its own — a real new
          PID, a real incremented restart count.
        </p>
      </>
    ),
    extra: <Pm2LoadBalancerDiagram />,
    demo: <PM2ProcessManagementRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/CachingScaling/PM2ProcessManagement/server.js", note: "A plain Express app — nothing PM2-specific in it at all, proving PM2 wraps real apps without needing them rewritten." },
      { path: "examples/CachingScaling/PM2ProcessManagement/demo.js", note: "Drives the real pm2 CLI directly: start, describe, a real simulated crash, and confirms the real auto-restart." },
    ],
    postmanCheck: <TryPm2Yourself />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Cache-aside is the base pattern: your own code checks Redis first, falls back to the real slow
        source on a miss, and stores the result with a real TTL — measured here at a real ~300x speed-up on a
        repeated request. Every write path that changes cached data needs its own invalidation step, in the same
        handler, not left for a TTL to eventually catch. Cache-aside alone doesn&apos;t protect against a stampede —
        single-flight (an in-process map of in-flight Promises) does, proven here as 10 real redundant computations
        collapsing to 1. A distributed lock (Redis&apos;s real SET NX PX) extends that same single-flight idea across
        MULTIPLE real app instances, which no in-process map could ever do. For scaling itself: cluster forks real,
        separate, fault-isolated OS processes for I/O-bound HTTP load; worker_threads splits one CPU-bound
        computation across real threads with genuinely shared memory — a real, clean distinction, not two names for
        the same thing. And PM2 packages cluster&apos;s real mechanics (fork, auto-restart, one shared port) into one
        production-grade tool, including a real, working load balancer via a single flag.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["cache-aside (check Redis, fall back on miss)", "invalidate on every write, not just TTL", "single-flight to stop a stampede", "a Redis lock to extend that across instances", "cluster (processes) vs worker_threads (shared-memory threads)", "PM2: the same mechanics, production-packaged"]} />
        <ClusterVsWorkerThreadsCard />
      </>
    ),
  },
];

export default function CachingScalingPage() {
  return (
    <StudyPage
      title="Caching & Scaling"
      stageLabel="Stage E — Testing, Tooling & Production Readiness"
      stageColor="green"
      intro="Real Redis caching end to end — cache-aside, invalidation, and stopping a cache stampede with single-flight — then a real distributed lock across instances, and real horizontal scaling with cluster, worker_threads, and PM2."
      sections={sections}
    />
  );
}

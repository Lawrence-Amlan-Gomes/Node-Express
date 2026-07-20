import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import DockerfileBasicsRunner from "@/example-runners/ContainerizationDeployment/DockerfileBasicsRunner";
import ComposeMultiContainerRunner from "@/example-runners/ContainerizationDeployment/ComposeMultiContainerRunner";
import DeployToCoolifyRunner from "@/example-runners/ContainerizationDeployment/DeployToCoolifyRunner";
import WhatIsAContainerRunner from "@/example-runners/ContainerizationDeployment/WhatIsAContainerRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function ShippingContainerDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Where the word &quot;container&quot; actually comes from — and why it applies to software too</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Before real shipping containers (1950s and earlier)</div>
          <div className="text-body text-xs leading-relaxed">
            Cargo was loaded by hand — barrels, sacks, crates, every shape different. Every port, every ship, every
            crane had to figure out how to handle whatever showed up. Slow, and things got damaged.
          </div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">After: one standard steel box</div>
          <div className="text-body text-xs leading-relaxed">
            Pack ANYTHING inside one uniform box. Now any ship, truck, or crane anywhere in the world can move it —
            without ever needing to know or care what&apos;s inside.
          </div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">Docker: the exact same idea, for software</div>
          <div className="text-body text-xs leading-relaxed">
            Pack your app together with everything it needs to run — the right Node version, every dependency, your
            code — into one standard box. Any computer with Docker installed can run that box and get the same real
            result, every time.
          </div>
        </div>
      </div>
    </div>
  );
}

function MultiStageBuildDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real, measured builds of the SAME app — where the extra weight actually comes from</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">Dockerfile.singlestage — ONE stage, ships everything</div>
          <div className="text-body text-xs leading-relaxed mb-2">
            FROM node:22 (the full image) → COPY the whole project in → npm install (installs devDependencies too).
            Every build tool and every dev-only package rides along into the final image, because there&apos;s only
            ever ONE image here.
          </div>
          <div className="font-mono text-xs text-red-500">Real measured size: 383.6 MB</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">Dockerfile — TWO stages, ships only one</div>
          <div className="text-body text-xs leading-relaxed mb-2">
            Stage &quot;deps&quot; installs real dependencies (production-only) in a throwaway image. Stage
            &quot;production&quot; starts completely fresh from a tiny Alpine base and COPYs only the already-built
            node_modules folder out of stage &quot;deps&quot; — the first stage itself never ships.
          </div>
          <div className="font-mono text-xs text-green-500">Real measured size: 56.0 MB</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">
          Real, measured by this section&apos;s own demo (docker image inspect on both real images) — not an assumed
          number. The single-stage image is ~6.8x larger for the exact same running app.
        </span>
      </div>
    </div>
  );
}

function LocalToProductionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The exact same real image, built twice, in two different real places</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">1. This laptop — proven first, before shipping anywhere</div>
          <div className="text-body text-xs leading-relaxed">
            <code className="text-cyan-500">docker build</code> + <code className="text-cyan-500">docker run</code>{" "}
            against this section&apos;s own Dockerfile, verified with a real local HTTP request — the exact demo
            below.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">2. A real, separate, dedicated GitHub repo</div>
          <div className="text-body text-xs leading-relaxed">
            Just this one app&apos;s files — kept OUT of this whole learning project&apos;s own repo on purpose, the
            same way a real deployable service lives in its own repo, not buried inside an unrelated app.
          </div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">3. A real, self-hosted Coolify server</div>
          <div className="text-body text-xs leading-relaxed">
            Coolify pulled that exact repo, ran <code className="text-green-500">docker build</code> against the
            SAME Dockerfile — no rewrite, no platform-specific config file — and started a real container on a real
            server with a real public URL.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-green-500 text-xs">
          This is Docker&apos;s actual promise, verified for real: &quot;works on my machine&quot; and &quot;works in
          production&quot; are now, genuinely, the same build.
        </span>
      </div>
    </div>
  );
}

// A dedicated visual block for a manual step against a DIFFERENT real
// host — same visual language as PostmanCheck, per the standing pattern
// in co-founder/build-conventions.md ("A PostmanCheck step to a
// DIFFERENT real host needs its own visual block, not a note paragraph").
function LiveDeploymentCheck() {
  const liveUrl = "http://vxtje7427t5gri6vp8guztf7.185.201.8.71.sslip.io";
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — a Real, Live, Deployed Server</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        This is NOT localhost. These two requests go to a real container running on a real, self-hosted Coolify
        server, built from{" "}
        <a
          className="text-cyan-500 underline"
          href="https://github.com/Lawrence-Amlan-Gomes/docker-deploy-demo"
          target="_blank"
          rel="noreferrer"
        >
          github.com/Lawrence-Amlan-Gomes/docker-deploy-demo
        </a>
        .
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border text-green-500 border-green-500/40 bg-green-500/10">GET</span>
            <code className="text-cyan-500 font-mono text-xs break-all">{liveUrl}/</code>
          </div>
          <div className="mt-2 text-xs leading-relaxed">
            <span className="text-green-500 font-semibold">Expect: </span>
            <span className="font-mono text-green-500">200</span>{" "}
            <span className="font-mono text-body">
              A real JSON object: {"{"}&quot;message&quot;:&quot;Hello from a real, deployed Docker
              container!&quot;,&quot;hostname&quot;:&quot;97b9b3defb21&quot;,&quot;nodeVersion&quot;:&quot;v22.23.1&quot;,&quot;environment&quot;:&quot;production&quot;,&quot;timestamp&quot;:&quot;&lt;a
              real current timestamp&gt;&quot;{"}"} — hostname stays fixed to this one real running container, and
              will change only if Coolify redeploys it.
            </span>
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border text-green-500 border-green-500/40 bg-green-500/10">GET</span>
            <code className="text-cyan-500 font-mono text-xs break-all">{liveUrl}/health</code>
          </div>
          <div className="mt-2 text-xs leading-relaxed">
            <span className="text-green-500 font-semibold">Expect: </span>
            <span className="font-mono text-green-500">200</span>{" "}
            <span className="font-mono text-body">{'{"status":"ok"}'} — the same real endpoint a host like Coolify polls to know this container is still alive.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposeNetworkDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real containers, one private network Compose builds automatically</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-cyan-500/40 bg-cyan-500/3 px-3 py-2">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-0.5">app container → redis container, BY SERVICE NAME</div>
          <div className="text-body text-xs leading-relaxed">
            The app&apos;s code connects to <code className="text-cyan-500">redis://redis:6379</code> — not an IP
            address, not localhost. &quot;redis&quot; is literally the OTHER service&apos;s name in
            docker-compose.yml. Docker Compose runs its own real internal DNS that resolves it.
          </div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">this Mac → redis container: NO PATH AT ALL</div>
          <div className="text-body text-xs leading-relaxed">
            docker-compose.yml deliberately publishes NO port for the redis service. Only the app container can
            reach it — proof that container-to-container networking doesn&apos;t require exposing anything to the
            outside world at all.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">this Mac → app container: localhost:4091</div>
          <div className="text-body text-xs leading-relaxed">
            The app service DOES publish a port (&quot;4091:4091&quot;) — the one thing meant to be reachable from
            outside the whole Compose setup, same as any other container.
          </div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Start Here: What Even IS a Container?",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "The Real Problem: \"It Works On My Machine\"",
              description: "You write an app. It runs perfectly on your own computer. Someone else runs the EXACT SAME code — maybe on a real server — and it breaks. Different computer, different setup, same code, different result. This isn't a beginner mistake. It happens to real, experienced teams all the time.",
            },
            {
              label: "The Old Idea That Explains Everything: Shipping Containers",
              description: "Before standard shipping containers existed, cargo ships were loaded by hand — every shape different, packed differently every time. Slow and messy. The fix: one uniform steel box. Pack anything inside it, and any ship, truck, or crane anywhere can move it, without caring what's inside.",
            },
            {
              label: "Docker Does the Exact Same Thing — for Software",
              description: "A Docker container packs your app together with EVERYTHING it needs to run — the right Node version, every dependency, your code, your settings — into one standard box. Any computer with Docker installed can run that box and get the exact same result. Every time.",
            },
            {
              label: "Two Words You'll See Constantly: Image vs Container",
              description: "An IMAGE is the sealed, unopened box — a real file, not doing anything yet. A CONTAINER is what you get the moment you actually OPEN and RUN that image — a real, live, running program.",
              example: "Think of an image like a recipe card, and a container like the dish actually cooked from it. You can cook the SAME recipe in five different kitchens at once — five separate containers, from one single image.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          A container isn&apos;t a virtual machine, and it isn&apos;t a trick — it&apos;s your app, permanently
          packed together with everything it needs, so it behaves exactly the same everywhere it runs.
        </Callout>
        <p>
          The demo below is the simplest possible real proof. It asks this real Mac one simple question —
          &quot;what&apos;s your hostname?&quot; — then asks a real Docker container the EXACT SAME question, from
          inside a real running container. Two completely different real answers, because the container really is a
          separate, sealed environment, not just a fancy way of running a script.
        </p>
      </>
    ),
    extra: <ShippingContainerDiagram />,
    demo: <WhatIsAContainerRunner />,
    demoCommand: "node isolation-proof.js",
    filePointers: [
      { path: "examples/ContainerizationDeployment/WhatIsAContainer/isolation-proof.js", note: "Asks this real Mac and a real container the same question, and shows the two different real answers." },
    ],
  },
  {
    heading: "Writing a Real Dockerfile (Multi-Stage Builds)",
    body: (
      <>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "A Dockerfile Is the Recipe for Building One of Those Boxes",
              description: "Every line in a Dockerfile is one real, plain instruction — like a real recipe's steps. Start from this base. Copy in these files. Run this command. Docker follows them top to bottom and saves the result as a real image — the sealed box from the last section, not yet running.",
            },
            {
              label: "Multi-Stage: Cook in a Messy Kitchen, But Only Serve the Clean Plate",
              description: "A Dockerfile can have more than one starting point (more than one FROM line). Think of the first one as a messy prep kitchen — full of tools and extra ingredients. The SECOND one starts completely fresh and clean, and only the finished dish gets carried over. Everything left behind in the messy kitchen never ships.",
              example: "COPY --from=deps /app/node_modules ./node_modules — carry over just the finished node_modules folder from the messy kitchen. Leave everything else behind.",
            },
            {
              label: "Alpine: a Tiny, Bare Kitchen Instead of a Fully Furnished One",
              description: "node:22-alpine and node:22 both really run Node.js — but -alpine starts from a much smaller, more bare-bones Linux system (a few MB), while plain node:22 starts from a much bigger, fully furnished one (hundreds of MB) with lots of extra stuff this app will never use.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="yellow">
          The box that actually ships should only contain what the running app needs — never the tools only used to
          BUILD it. That&apos;s the whole idea behind multi-stage builds, and you get it for free, in one file.
        </Callout>
        <p>
          The demo below builds BOTH real Dockerfiles in this example — the naive single-stage one and the real
          multi-stage one — measures each real image&apos;s real size with <code>docker image inspect</code>, then
          actually runs the multi-stage image as a real container and hits it with a real HTTP request from outside.
        </p>
      </>
    ),
    extra: <MultiStageBuildDiagram />,
    demo: <DockerfileBasicsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ContainerizationDeployment/DockerfileBasics/Dockerfile", note: "The real, production-worthy multi-stage build — what this app actually ships." },
      { path: "examples/ContainerizationDeployment/DockerfileBasics/Dockerfile.singlestage", note: "The naive comparison build — real and genuinely built, only to measure the real size gap." },
      { path: "examples/ContainerizationDeployment/DockerfileBasics/.dockerignore", note: "Keeps node_modules, .git, and .env out of the build context entirely — never sent to Docker in the first place." },
      { path: "examples/ContainerizationDeployment/DockerfileBasics/server.js", note: "A plain Express app — nothing in it is Docker-specific. Docker wraps this file; it never changes it." },
      { path: "examples/ContainerizationDeployment/DockerfileBasics/demo.js", note: "Builds both real images, measures their real sizes, and proves the shipped one actually runs." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ContainerizationDeployment/DockerfileBasics"
        runCommand='docker build -t dockerfile-basics . && docker run --rm -p 4090:4090 dockerfile-basics'
        runPort={4090}
        steps={[
          {
            method: "GET",
            path: "/",
            note: "hostname is the real container's own short ID — it will be different every time you run this, proving the response really came from inside a container.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"message":"Hello from inside a real Docker container!","hostname":"<a real container ID, differs every run>","nodeVersion":"v22.23.1","platform":"linux","uptimeSeconds":<a small real number>}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Docker Compose for Multi-Container Apps",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "A Real App Almost Never Lives Alone",
              description: "Real backends usually need a helper running alongside them — a real database, or a real cache like Redis. You COULD start each box by hand and manually tell them how to find each other, but that gets messy fast, especially as more boxes get added.",
            },
            {
              label: "docker-compose.yml: One List That Starts Every Box Together",
              description: "Instead of starting each box separately, you write one file listing everything you need — this app's box, and a Redis box. Run ONE command, and every box starts together, on its own private network Docker builds automatically.",
            },
            {
              label: "Boxes Find Each Other BY NAME — Like Calling a Roommate, Not Their GPS Coordinates",
              description: "Compose gives every box a name — literally whatever you called it in the file. This app's box doesn't need any IP address to reach the Redis box. It just says \"redis,\" the same way you'd call a roommate by name instead of memorizing their exact location.",
              example: "redis://redis:6379 — \"redis\" is just a name Compose already knows how to find, every single run.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          Docker Compose doesn&apos;t just start multiple boxes — it gives them a real, private network where they
          find each other BY NAME, with zero manual wiring, while staying completely unreachable from outside unless
          you deliberately open a door for one of them.
        </Callout>
        <p>
          The demo below runs <code>docker compose up</code> for real — a real Express app container and a real
          Redis container — then calls the same real, deliberately expensive endpoint twice: once as a genuine cache
          miss (the app computes it the slow way and stores the result in the OTHER container), and once as a
          genuine cache hit, measuring the real speed difference.
        </p>
      </>
    ),
    extra: <ComposeNetworkDiagram />,
    demo: <ComposeMultiContainerRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ContainerizationDeployment/ComposeMultiContainer/docker-compose.yml", note: "Describes both real services — the app (built from this folder's Dockerfile) and Redis (a real official image, no Dockerfile needed)." },
      { path: "examples/ContainerizationDeployment/ComposeMultiContainer/controllers/fibonacci.controller.js", note: "The only file that talks to Redis — checks the real cache first, falls back to a real, deliberately slow computation on a genuine miss." },
      { path: "examples/ContainerizationDeployment/ComposeMultiContainer/Dockerfile", note: "The same real multi-stage pattern from the previous section, applied here too — not regressed back to single-stage." },
      { path: "examples/ContainerizationDeployment/ComposeMultiContainer/demo.js", note: "Starts the real multi-container setup, proves a real cache miss then a real cache hit, tears it back down." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ContainerizationDeployment/ComposeMultiContainer"
        runCommand="docker compose up --build"
        runPort={4091}
        steps={[
          {
            method: "GET",
            path: "/fib/40",
            note: "First call on a freshly started setup — the real Redis container starts empty, so this is a genuine cache miss.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"n":40,"result":102334155,"source":"computed","tookMs":<a real number, roughly 900-1500ms on this machine>}',
          },
          {
            method: "GET",
            path: "/fib/40",
            note: "Same request, right after the one above — now a genuine cache hit.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"n":40,"result":102334155,"source":"cache","tookMs":<a real number, close to 0>}',
          },
          {
            method: "DELETE",
            path: "/fib/40",
            note: "Cleans up the real cache entry this created, so a re-run genuinely starts from a miss again.",
            expectStatus: 200,
            expectBody: '{"n":40,"deleted":true}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Shipping to a Real Host (Coolify)",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "This App's Box Gets Its Own Real Address",
              description: "This section's app lives at its normal path inside this project too (so the FilePointers below still work), but it's ALSO pushed to its own real, separate GitHub repo — the same way a real backend service lives in its own home, not buried inside an unrelated app.",
              example: "github.com/Lawrence-Amlan-Gomes/docker-deploy-demo — nothing else from this whole learning project is in it.",
            },
            {
              label: "Coolify Builds the EXACT Same Box You Already Tested on This Laptop",
              description: "Coolify is a real, self-hosted tool that runs Docker boxes on a real server for you — the same idea as Render/Railway/Heroku. Point it at the real repo, tell it which real Dockerfile to use, and it builds the SAME box this laptop already built, just on a different real machine.",
            },
            {
              label: "Secrets Never Get Packed Inside the Box — They Get Handed to It When It Starts",
              description: "Think of it like a hotel key card: the hotel doesn't build your key into the room's walls, it hands you one at check-in. Real passwords and API keys work the same way — they get handed to the container when it STARTS running on the real server, never baked into the box itself.",
            },
            {
              label: "A Health Check Is the Box Waving \"I'm Still Alive\" Every Few Seconds",
              description: "GET /health isn't decoration — Coolify (and every real hosting platform) checks an endpoint like this on a real interval to decide whether to keep sending traffic to a box, or replace it if it's stopped responding.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          Once an app is packed into a real box, deploying it stops being a special, one-off process — it becomes:
          hand the same real box to anywhere that can run boxes. The Dockerfile that worked on this laptop is the
          exact same one a real host builds too.
        </Callout>
        <p>
          The demo below builds and runs this section&apos;s real app locally first, exactly like the first section
          on this page — the same real image was then actually deployed to a real, self-hosted Coolify server. The
          live, publicly reachable proof of that is below the demo.
        </p>
      </>
    ),
    extra: <LocalToProductionDiagram />,
    demo: <DeployToCoolifyRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ContainerizationDeployment/DeployToCoolify/Dockerfile", note: "The exact same real Dockerfile Coolify built on the real server — no platform-specific rewrite needed." },
      { path: "examples/ContainerizationDeployment/DeployToCoolify/controllers/deploy.controller.js", note: "Real GET / and GET /health handlers — identical whether running on this laptop or on the real deployed server." },
      { path: "examples/ContainerizationDeployment/DeployToCoolify/server.js", note: "Reads PORT from process.env — the same real ESM run-guard pattern used across this whole project." },
    ],
    postmanCheck: (
      <>
        <PostmanCheck
          folderPath="examples/ContainerizationDeployment/DeployToCoolify"
          runCommand='docker build -t deploy-to-coolify . && docker run --rm -p 4092:4092 deploy-to-coolify'
          runPort={4092}
          steps={[
            {
              method: "GET",
              path: "/",
              note: "Run this against your OWN local container first — environment will read \"development\" here, since NODE_ENV=production is only set inside the real Dockerfile's ENV line when Coolify builds it, but this local docker run command doesn't set it manually the same way. hostname is this container's own real, random ID.",
              expectStatus: 200,
              expectBody: 'A real JSON object: {"message":"Hello from a real, deployed Docker container!","hostname":"<a real container ID>","nodeVersion":"v22.23.1","environment":"production","timestamp":"<a real current timestamp>"}',
            },
            {
              method: "GET",
              path: "/health",
              expectStatus: 200,
              expectBody: '{"status":"ok"}',
            },
          ]}
        />
        <LiveDeploymentCheck />
      </>
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. A Dockerfile is a real recipe for a real image — a frozen snapshot of a filesystem plus a
        startup command. Multi-stage builds let you use one throwaway stage to install/build things, and ship only a
        second, much smaller stage — measured directly on this page, a 6.8x real size difference for the identical
        running app. Docker Compose extends the same idea to MULTIPLE real containers that need to run together,
        giving them a private network where they reach each other by service name, not by IP or localhost — proven
        here with a real Redis cache giving a ~940x real speed-up on a repeated request. And the whole point of
        packaging an app into a container is that the exact same image runs identically anywhere a container can
        run — proven end to end by taking the identical Dockerfile from this laptop to a real, live, publicly
        reachable deployment on a real Coolify server, with zero code changes.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["write a real Dockerfile", "multi-stage: build stage vs. production stage", "docker build → one real, portable image", "docker compose for multiple real containers, networked by name", "the SAME image, deployed to a real host (Coolify)"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Multi-stage builds exist to keep build-time tools and devDependencies OUT of the final image — the real, measured gap here was 6.8x, not a hand-wavy 'it's smaller.'",
            "Alpine base images are a real, minimal Linux distro (musl libc, not glibc) — not a magic flag, an actual different, much smaller OS underneath Node.",
            "Docker Compose's real value for an interview answer: automatic private networking between containers, reachable by SERVICE NAME (real DNS Compose manages), with zero manual IP wiring — and nothing is reachable from outside unless a port is deliberately published.",
            "Secrets/config discipline is a real interview signal: never bake a secret into an image at build time (COPY .env, a hardcoded ENV). Real hosts inject environment variables into the container at START time instead — this project already established the same discipline for Prisma/.env and the AWS SDK's credentials.",
            "'Works on my machine' vs 'works in production' is exactly the problem containers solve — the strongest answer is naming that you've actually verified it: the identical image built locally is the one a real host deployed, unmodified.",
          ]}
        />
      </>
    ),
  },
];

export default function ContainerizationDeploymentPage() {
  return (
    <StudyPage
      title="Containerization & Deployment"
      stageLabel="Stage E — Testing, Tooling & Production Readiness"
      stageColor="yellow"
      intro="Starting from zero: what a container even is, then packaging a real Express app into a real Docker image, running multiple real containers together with Compose, and shipping the same real image to a real, live host — proven end to end, not just described."
      sections={sections}
    />
  );
}

import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import WhyNotJustPollingRunner from "@/example-runners/WebSocketsRealTime/WhyNotJustPollingRunner";
import ServerSentEventsRunner from "@/example-runners/WebSocketsRealTime/ServerSentEventsRunner";
import RawWebSocketsRunner from "@/example-runners/WebSocketsRealTime/RawWebSocketsRunner";
import SocketIoRoomsRunner from "@/example-runners/WebSocketsRealTime/SocketIoRoomsRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function PollingWasteDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Polling: the client asks over and over, whether or not anything changed</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Every poll is a brand new, real HTTP request</div>
          <div className="text-body text-xs leading-relaxed">A real TCP handshake (or reused connection), real headers, a real round trip — every single time, even when the answer is &quot;nothing changed.&quot;</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Poll too slowly, and updates feel late</div>
          <div className="text-body text-xs leading-relaxed">A real change can sit unseen for up to one full real polling interval before the client happens to ask again.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Poll too fast, and most requests are pure waste</div>
          <div className="text-body text-xs leading-relaxed">This section&apos;s demo polls every 300ms while the real value only changes roughly every 900ms — most real requests come back saying &quot;still the same.&quot;</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">There is no setting that fixes both problems at once — that tension is the real reason polling isn&apos;t the final answer.</span>
      </div>
    </div>
  );
}

function SseDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">SSE: ONE real HTTP request stays open, the server keeps writing to it</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">The client makes exactly ONE real request: GET /events</div>
          <div className="text-body text-xs leading-relaxed">A completely normal HTTP GET — no special client library needed, plain <code>fetch()</code> works, since SSE is just plain HTTP with a response that never &quot;finishes.&quot;</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">The server keeps that ONE real connection open and writes to it repeatedly</div>
          <div className="text-body text-xs leading-relaxed">Each real write is one line: <code>data: &lt;payload&gt;\n\n</code> — the server decides when something is worth sending, not the client.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">One-way only: server → client</div>
          <div className="text-body text-xs leading-relaxed">The client has no way to send anything back over this same connection — for that, it would still need a separate, ordinary HTTP request.</div>
        </div>
      </div>
    </div>
  );
}

function RawWebSocketDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">WebSocket: ONE real connection, genuinely two real directions</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">It starts as a real HTTP request that &quot;upgrades&quot;</div>
          <div className="text-body text-xs leading-relaxed">The client asks for <code>ws://host/ws</code>; the server agrees, and that SAME real TCP connection stops being HTTP and becomes a WebSocket instead.</div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">Server → client, with no request needed</div>
          <div className="text-body text-xs leading-relaxed">This section&apos;s demo server sends a real &quot;welcome&quot; message the instant a client connects — something a plain REST endpoint can never do on its own.</div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">Client → server, over the SAME connection</div>
          <div className="text-body text-xs leading-relaxed">The demo&apos;s client sends a real &quot;ping&quot; and gets a real &quot;pong&quot; back — no new connection, no new handshake, just more messages on the one already open.</div>
        </div>
      </div>
    </div>
  );
}

function SocketIoRoomsDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Socket.io rooms — a real broadcast, scoped to only who joined</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">socket.join(&quot;general&quot;) — a real, server-side label on this one connection</div>
          <div className="text-body text-xs leading-relaxed">No new connection is made — Socket.io just remembers &quot;this real socket is also part of room general&quot; on the server.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">io.to(&quot;general&quot;).emit(...) reaches every real socket in that room</div>
          <div className="text-body text-xs leading-relaxed">This section&apos;s demo: 2 real clients join &quot;general,&quot; 1 joins &quot;random.&quot; A message sent to &quot;general&quot; is received by the 2 — the one in &quot;random&quot; gets nothing.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Rooms are a Socket.io feature, not a raw WebSocket one</div>
          <div className="text-body text-xs leading-relaxed">Plain WebSockets have no concept of &quot;rooms&quot; at all — you&apos;d have to track which sockets belong together yourself, by hand.</div>
        </div>
      </div>
    </div>
  );
}

function TryRawWebSocketYourself() {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — In Postman</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        Postman has a real, dedicated WebSocket request type — this is a genuinely different flow from every other
        PostmanCheck on this site, since there&apos;s no single request/response to show.
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">
            cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/WebSocketsRealTime/RawWebSockets&quot; &amp;&amp; node server.js
          </code>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. In Postman: New &rarr; WebSocket Request</div>
          <div className="text-xs text-body leading-relaxed">
            Enter <code className="text-cyan-500">ws://localhost:4105/ws</code> and click Connect.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. Watch the message log — with no message sent yet</div>
          <div className="text-xs text-body leading-relaxed">
            A real message arrives on its own: <code className="text-cyan-500">{'{"type":"welcome","message":"Real WebSocket connection open. Send me anything."}'}</code>
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">4. Type ping in the message box and click Send</div>
          <div className="text-xs text-body leading-relaxed">
            A real reply arrives immediately: <code className="text-cyan-500">{'{"type":"pong","serverTime":<a real timestamp>}'}</code> — over the SAME connection, no new request.
          </div>
        </div>
      </div>
    </div>
  );
}

function TrySocketIoYourself() {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — In Postman</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        Postman also has a real, dedicated Socket.io request type. This walkthrough opens TWO real connections at once
        to prove room isolation with your own eyes, the same thing the demo above already proved in code.
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">
            cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/WebSocketsRealTime/SocketIoRooms&quot; &amp;&amp; node server.js
          </code>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. In Postman: New &rarr; Socket.io Request (open it TWICE, two tabs)</div>
          <div className="text-xs text-body leading-relaxed">
            Both tabs: enter <code className="text-cyan-500">http://localhost:4106</code> and click Connect.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. Tab 1: emit join-room with the message &quot;general&quot;</div>
          <div className="text-xs text-body leading-relaxed">Tab 2: emit join-room with the message &quot;random&quot;.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">4. From Tab 1, emit send-to-room with a real JSON body</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">{'{"room":"general","message":"hi"}'}</code>
          <div className="mt-1.5 text-xs text-body leading-relaxed">
            A real <code className="text-cyan-500">room-message</code> event arrives in Tab 1 — Tab 2 gets nothing at all,
            since it joined a different room.
          </div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Why Not Just Poll?",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "The Old Default: Ask Again, and Again, and Again",
              description: "Think of it like calling a friend every 5 minutes to ask \"is dinner ready yet?\" instead of them just calling YOU the moment it is. That's polling: the client makes a real, ordinary HTTP request on a timer, over and over, just to check.",
            },
            {
              label: "There's No Interval That's Actually Right",
              description: "Poll slowly and real updates feel late — a change can sit unseen for up to one full interval. Poll quickly and almost every real request comes back saying \"nothing changed\" — pure waste, repeated forever.",
              example: "This section's demo polls every 300ms while the real value only changes roughly every 900ms — most of its real requests are wasted ones.",
            },
            {
              label: "Still a Real, Legitimate Tool — Just Not for Everything",
              description: "Polling is simple, needs zero new infrastructure, and is genuinely fine for things that change rarely or where a few seconds of delay is no big deal. It just doesn't scale to anything that needs to feel instant.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          Polling makes the CLIENT responsible for guessing when to ask. Everything else in this topic exists to flip
          that: let the SERVER decide when there&apos;s something worth sending.
        </Callout>
        <p>
          The demo below polls a real, independently-changing price every 300ms for 3 real seconds, and counts exactly
          how many of those real requests were wasted — asked, answered &quot;nothing changed.&quot;
        </p>
      </>
    ),
    extra: <PollingWasteDiagram />,
    demo: <WhyNotJustPollingRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WebSocketsRealTime/WhyNotJustPolling/controllers/price.controller.js", note: "A real value that changes on its OWN schedule, completely independent of any request." },
      { path: "examples/WebSocketsRealTime/WhyNotJustPolling/demo.js", note: "Polls the real endpoint every 300ms for 3 real seconds and counts the real waste." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/WebSocketsRealTime/WhyNotJustPolling"
        runCommand="node server.js"
        runPort={4103}
        steps={[
          {
            method: "GET",
            path: "/latest-price",
            note: "First call — the current real price.",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"price":<a real number>,"changedAt":<a real timestamp in ms>}',
          },
          {
            method: "GET",
            path: "/latest-price",
            note: "Immediately again — the real price only ticks roughly every 900ms, so this is very likely identical to the last call.",
            expectStatus: 200,
            expectBody: "The SAME real price and changedAt as the previous call, most of the time.",
          },
          {
            method: "GET",
            path: "/latest-price",
            note: "Wait about 1 real second, then send this same request again.",
            expectStatus: 200,
            expectBody: "A real, DIFFERENT price and changedAt than before, most of the time — the value ticked on its own while you waited.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Server-Sent Events (SSE)",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "One Real Request, Left Open on Purpose",
              description: "Instead of the client asking over and over, it asks ONCE — and the server just keeps that same real connection open, writing a new real message into it whenever there's something worth sending.",
            },
            {
              label: "It's Genuinely Just Plain HTTP",
              description: "No new protocol, no special port, no library required on the client. The server sends a special Content-Type (text/event-stream) and never calls res.end() — that's the entire trick.",
              example: "This section's own demo.js connects with a completely ordinary fetch() call — the same function used everywhere else in this project.",
            },
            {
              label: "The Real Limit: One-Way Only",
              description: "Server → client, full stop. If the client ever needs to send something back, that still has to be a separate, ordinary HTTP request — SSE has no channel going the other direction.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          SSE is the right tool the moment you only need the server pushing TO the client — live scores, notifications,
          a progress bar — without paying for a whole new connection type.
        </Callout>
        <p>
          The demo below opens exactly one real connection to <code>/events</code> and receives 5 real, server-pushed
          events over it before the server closes the connection on its own.
        </p>
      </>
    ),
    extra: <SseDiagram />,
    demo: <ServerSentEventsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WebSocketsRealTime/ServerSentEvents/controllers/events.controller.js", note: "Writes real \"data: ...\\n\\n\" messages onto ONE already-open connection, on a real interval." },
      { path: "examples/WebSocketsRealTime/ServerSentEvents/demo.js", note: "A plain fetch() call that reads the real streaming response body chunk by chunk." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/WebSocketsRealTime/ServerSentEvents"
        runCommand="node server.js"
        runPort={4104}
        steps={[
          {
            method: "GET",
            path: "/events",
            note: "Watch Postman's response panel as it arrives, don't just look at the final result — this is a real, single connection that stays open.",
            expectStatus: 200,
            expectBody: 'A real, continuous stream: data: {"tick":1,"serverTime":...}, about 500ms later data: {"tick":2,...}, all the way through tick 5 — then the connection closes on its own.',
          },
        ]}
      />
    ),
  },
  {
    heading: "Raw WebSockets — True Two-Way",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "SSE's Missing Half: the Client Talking Back",
              description: "A WebSocket is one real connection that both sides can write to, at any time, in either direction — a real phone call staying open, instead of mailing letters back and forth.",
            },
            {
              label: "It Starts as HTTP, Then \"Upgrades\"",
              description: "The client's first request really is an ordinary HTTP request asking to switch protocols. If the server agrees, that SAME real TCP connection becomes a WebSocket — no second connection is opened.",
            },
            {
              label: "Express Needs Help Here — It Has No Upgrade Handling of Its Own",
              description: "This section's server creates a real node:http server directly, hands Express to it as the normal request handler, then attaches a WebSocketServer (the ws package) to that same real server.",
              example: "This section's demo proves both directions for real: the server pushes a \"welcome\" message unprompted, then replies to a real client-sent \"ping\" with a real \"pong\".",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          Reach for a raw WebSocket only when you genuinely need the client sending real-time data back too — chat
          input, live cursor positions, game moves. If it&apos;s purely server → client, SSE is simpler and does the job.
        </Callout>
        <p>
          The demo below connects one real WebSocket client, receives the server&apos;s unprompted real &quot;welcome&quot;
          message, sends a real &quot;ping&quot;, and receives a real &quot;pong&quot; back — all over the one connection.
        </p>
      </>
    ),
    extra: <RawWebSocketDiagram />,
    demo: <RawWebSocketsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WebSocketsRealTime/RawWebSockets/server.js", note: "Creates a real node:http server, hands it to Express, then attaches a real WebSocketServer to the SAME server." },
      { path: "examples/WebSocketsRealTime/RawWebSockets/sockets/echo.socket.js", note: "The real, two-way connection logic — a push on connect, a reply to \"ping\"." },
      { path: "examples/WebSocketsRealTime/RawWebSockets/demo.js", note: "A real ws client, proving both directions actually work." },
    ],
    postmanCheck: <TryRawWebSocketYourself />,
  },
  {
    heading: "Socket.io in Practice: Rooms",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Socket.io Isn't a Different Protocol — It's WebSockets Plus Real Extras",
              description: "Under the hood it opens a real WebSocket connection (falling back to real HTTP long-polling automatically if a WebSocket genuinely can't be established) and adds higher-level features most real apps end up needing anyway.",
            },
            {
              label: "Rooms: a Real, Server-Side Grouping of Connections",
              description: "socket.join(\"general\") doesn't open anything new — it just labels one already-open real connection as part of a named group, entirely on the server.",
            },
            {
              label: "Broadcasting to a Room Reaches ONLY That Room",
              description: "io.to(\"general\").emit(...) sends to every real socket that joined \"general\" — a socket in a different room, or no room at all, gets nothing.",
              example: "This section's demo: 2 real clients join \"general,\" 1 joins \"random.\" A message sent to \"general\" reaches the 2 — the third receives nothing, proven by checking its real received-messages array is empty.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          Rooms are the real, practical reason most production apps reach for Socket.io instead of the raw ws package
          directly — chat channels, per-document collaborators, per-user notification streams are all just rooms.
        </Callout>
        <p>
          The demo below connects 3 real Socket.io clients, puts 2 of them in one room and 1 in another, then proves —
          by inspecting each client&apos;s own real received messages — that the broadcast reached only the right room.
        </p>
      </>
    ),
    extra: <SocketIoRoomsDiagram />,
    demo: <SocketIoRoomsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/WebSocketsRealTime/SocketIoRooms/sockets/room.socket.js", note: "The real room logic: join-room labels a connection, send-to-room broadcasts only to that room." },
      { path: "examples/WebSocketsRealTime/SocketIoRooms/demo.js", note: "3 real Socket.io clients, 2 rooms, proving isolation by comparing each client's real received messages." },
    ],
    postmanCheck: <TrySocketIoYourself />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Polling is simple but forces a tradeoff between real staleness and real wasted requests — there&apos;s
        no interval that fixes both. SSE fixes the waste for the common case (server → client only) using nothing but
        plain HTTP: one real request, left open, with the server writing new events into it whenever it actually has
        one. WebSockets add the missing direction — a real, genuinely two-way connection, needed the moment the client
        has to send real-time data back too (chat, live cursors, game state) — at the cost of Express needing a real
        raw node:http server underneath, since Express itself has no upgrade handling. Socket.io sits on top of
        WebSockets and adds the features almost every real app ends up wanting anyway: automatic reconnection, a
        long-polling fallback, and rooms — a real, server-side way to broadcast to just one group of connections
        instead of everyone. The real interview-relevant progression: reach for the SIMPLEST option that still solves
        the problem — polling, then SSE, then a raw WebSocket, then Socket.io — not WebSockets by default.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["polling (simple, but wasteful or laggy)", "SSE (plain HTTP, one-way push)", "raw WebSocket (two-way, needs node:http)", "Socket.io (WebSocket + reconnection + rooms)"]} />
        <ComparisonCard
          tone="good"
          title="Which one, when — the real decision"
          points={[
            "Only need to occasionally check something, and a few seconds of delay is fine? Plain polling is genuinely OK — it needs zero new infrastructure.",
            "Server needs to push updates, client never needs to talk back? SSE — plain HTTP, works through normal proxies/load balancers with no special config.",
            "Client genuinely needs to send real-time data back too? A raw WebSocket, if you want minimal dependencies and full control.",
            "Building anything with rooms/channels, or want automatic reconnection and a fallback for flaky networks handled for you? Socket.io.",
          ]}
        />
      </>
    ),
  },
];

export default function WebSocketsRealTimePage() {
  return (
    <StudyPage
      title="WebSockets & Real-Time"
      stageLabel="Stage F — Advanced & Interview Prep"
      stageColor="cyan"
      intro="The real progression from polling to Server-Sent Events to WebSockets and Socket.io — when you'd reach for each one, not just how to wire it up."
      sections={sections}
    />
  );
}

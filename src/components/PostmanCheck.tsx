const methodColor: Record<string, string> = {
  GET: "text-green-500 border-green-500/40 bg-green-500/10",
  POST: "text-orange-500 border-orange-500/40 bg-orange-500/10",
  PUT: "text-yellow-500 border-yellow-500/40 bg-yellow-500/10",
  PATCH: "text-yellow-500 border-yellow-500/40 bg-yellow-500/10",
  DELETE: "text-red-500 border-red-500/40 bg-red-500/10",
};

export interface PostmanStep {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  // Just the path — the full URL is built from runPort below, e.g. "/greet/Lawrence".
  path: string;
  // Real request headers to set in Postman (e.g. { "X-User-Id": "1" }) —
  // shown under the request, never folded into the expected response.
  headers?: Record<string, string>;
  body?: string; // a real example request body, JSON as a string, only for methods that need one
  // A short instruction/context line about THIS REQUEST specifically
  // (e.g. "send with no X-User-Id header at all", "the 6th request in
  // the same 60-second window") — shown next to the request, never
  // appended to expectBody. Only for guidance the request/headers/body
  // fields above can't already express on their own.
  note?: string;
  expectStatus: number;
  // The real, already-verified response BODY ONLY — never append
  // instructions or context here, that's what `note` above is for.
  expectBody: string;
  // Real, already-verified response headers worth checking, when the
  // header IS the point (e.g. RateLimit-Remaining, X-Powered-By).
  expectHeaders?: Record<string, string>;
  // Overrides runPort for just this ONE step — only needed when a single
  // run command starts more than one real server (e.g. a before/after
  // comparison on two ports, see HelmetSecurityHeaders). Falls back to
  // runPort when omitted, which covers every normal, single-port example.
  port?: number;
}

// The absolute path to this project's own root on disk — used to build a
// real, directly copy-pasteable "cd" command, since the user asked for the
// exact terminal command, not just "run this in that folder yourself".
const PROJECT_ROOT = "/Users/lawrencealangomes/Documents/Node Express";

// A step-by-step "try this yourself" guide for a real Express server this
// project already proved works via its own live demo — every value here
// must be a genuinely verified real result, never invented. Only used on
// sections whose example actually listens on a real, stable port when run
// directly (see co-founder/build-conventions.md's Postman-guide entry).
export default function PostmanCheck({
  folderPath,
  runCommand,
  runPort,
  extraPorts,
  steps,
}: {
  folderPath: string; // relative to the project root, e.g. "examples/ExpressAppRouting/CreatingTheApp"
  runCommand: string;
  runPort: number;
  // Only needed when the SAME run command starts more than one real
  // server at once (e.g. a before/after comparison on two ports) — each
  // entry is rendered as an extra "also listens on" line under step 3.
  extraPorts?: { port: number; label: string }[];
  steps: PostmanStep[];
}) {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself in Postman</span>
      </div>

      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 mb-3 flex flex-col gap-1.5">
        <div className="text-body text-xs leading-relaxed">
          <span className="font-semibold">1. Open a terminal and go to that folder:</span>
          <pre className="mt-1 font-mono text-xs text-orange-500 bg-orange-500/10 rounded px-2 py-1.5 whitespace-pre-wrap break-all">
            cd &quot;{PROJECT_ROOT}/{folderPath}&quot;
          </pre>
        </div>
        <div className="text-body text-xs leading-relaxed">
          <span className="font-semibold">2. Start the real server:</span>{" "}
          <code className="text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded font-mono text-xs">{runCommand}</code>
        </div>
        <div className="text-body text-xs leading-relaxed">
          <span className="font-semibold">3. It listens on a real, fixed port:</span>{" "}
          <code className="text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded font-mono text-xs">
            http://localhost:{runPort}
          </code>
          . Leave that terminal running.
        </div>
        {extraPorts?.map((extra) => (
          <div key={extra.port} className="text-body text-xs leading-relaxed">
            <span className="font-semibold">Also listens on ({extra.label}):</span>{" "}
            <code className="text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded font-mono text-xs">
              http://localhost:{extra.port}
            </code>{" "}
            — the SAME command above starts both real servers at once.
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {steps.map((step, i) => (
          <div key={`${i}-${step.method}-${step.path}`} className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs mb-1.5">4.{i + 1}. In Postman, create a new request:</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${methodColor[step.method]}`}>
                {step.method}
              </span>
              <code className="text-cyan-500 font-mono text-xs break-all">
                http://localhost:{step.port ?? runPort}
                {step.path}
              </code>
            </div>
            {step.headers && (
              <div className="mt-2">
                <div className="text-sublabel text-[11px] uppercase tracking-wide mb-1">Headers</div>
                <div className="flex flex-col gap-1">
                  {Object.entries(step.headers).map(([name, value]) => (
                    <code key={name} className="font-mono text-xs text-body bg-surface rounded px-2 py-1 border border-border w-fit">
                      {name}: {value}
                    </code>
                  ))}
                </div>
              </div>
            )}
            {step.body && (
              <div className="mt-2">
                <div className="text-sublabel text-[11px] uppercase tracking-wide mb-1">Body (raw JSON)</div>
                <pre className="font-mono text-xs text-body whitespace-pre-wrap bg-surface rounded px-2 py-1.5 border border-border">
                  {step.body}
                </pre>
              </div>
            )}
            {step.note && <div className="mt-2 text-xs text-sublabel leading-relaxed italic">{step.note}</div>}
            <div className="mt-2 text-xs leading-relaxed">
              <span className="text-green-500 font-semibold">Expect: </span>
              <span className="font-mono text-green-500">{step.expectStatus}</span>{" "}
              <span className="font-mono text-body">{step.expectBody}</span>
            </div>
            {step.expectHeaders && (
              <div className="mt-1 flex flex-col gap-1">
                {Object.entries(step.expectHeaders).map(([name, value]) => (
                  <code key={name} className="font-mono text-xs text-green-500 bg-green-500/10 rounded px-2 py-1 border border-green-500/30 w-fit">
                    {name}: {value}
                  </code>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

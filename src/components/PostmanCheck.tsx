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
  body?: string; // a real example request body, JSON as a string, only for methods that need one
  expectStatus: number;
  expectBody: string; // the real, already-verified response body (or a plain description of it)
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
  steps,
}: {
  folderPath: string; // relative to the project root, e.g. "examples/ExpressAppRouting/CreatingTheApp"
  runCommand: string;
  runPort: number;
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
                http://localhost:{runPort}
                {step.path}
              </code>
            </div>
            {step.body && (
              <div className="mt-2">
                <div className="text-sublabel text-[11px] uppercase tracking-wide mb-1">Body (raw JSON)</div>
                <pre className="font-mono text-xs text-body whitespace-pre-wrap bg-surface rounded px-2 py-1.5 border border-border">
                  {step.body}
                </pre>
              </div>
            )}
            <div className="mt-2 text-xs leading-relaxed">
              <span className="text-green-500 font-semibold">Expect: </span>
              <span className="font-mono text-green-500">{step.expectStatus}</span>{" "}
              <span className="text-body">{step.expectBody}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

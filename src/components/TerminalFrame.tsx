"use client"; // needs router.refresh() for the rerun button below — children can still be Server-Component-rendered content passed straight through

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

// Mock-terminal chrome — the backend equivalent of a browser window. There's
// no rendered page to show for most backend concepts, so the "proof it's
// real" surface here is a terminal: the exact command that was actually run,
// and its exact captured output. Every TerminalFrame's children come from a
// runner that genuinely executed real code server-side (see
// co-founder/build-conventions.md) — never a fabricated transcript.
//
// Standing rule: the rerun button calls router.refresh(), which re-renders
// the Server Component runner behind this frame — for runners that spawn a
// real process or hit a real in-memory request each render, this is a
// genuine re-execution, not a decorative animation.
export default function TerminalFrame({
  command,
  children,
}: {
  command: string; // the real command that was actually run to produce the output below, e.g. "node event-loop-order.js"
  children: ReactNode;
}) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  function handleRerun() {
    setSpinning(true);
    router.refresh();
    setTimeout(() => setSpinning(false), 400);
  }

  return (
    <div className="border border-green-500/35 rounded-card overflow-hidden bg-surface my-3">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-raised border-b border-green-500/35">
        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-green-500" />
        <span className="ml-2 font-mono text-xs text-sublabel truncate">{command}</span>
        <button
          type="button"
          onClick={handleRerun}
          title="Rerun — re-executes the real code behind this demo"
          className="ml-auto text-sublabel hover:text-title text-sm leading-none px-1"
        >
          {spinning ? "⟳" : "▶"}
        </button>
      </div>
      <div className="min-h-40 overflow-auto p-4 bg-bg font-mono text-sm leading-relaxed text-body whitespace-pre-wrap">
        <span className="text-green-500">$ </span>
        {command}
        {"\n"}
        {children}
      </div>
    </div>
  );
}

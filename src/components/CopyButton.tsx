"use client";

import { useState } from "react";

// A small, reusable copy-to-clipboard icon button — dropped beside any real
// terminal command, URL, JSON body, or SQL query in a "Try It Yourself"
// guide so the user can click instead of manually selecting/retyping it.
// Standing rule since 2026-07-31, see co-founder/build-conventions.md.
export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string; // the exact real string that gets copied — never a placeholder
  label?: string; // shown in the tooltip/aria-label, e.g. "Copy command"
  className?: string; // caller controls color (e.g. text-orange-500) to match its block
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : label}
      title={copied ? "Copied!" : label}
      className={`inline-flex items-center justify-center shrink-0 w-6 h-6 rounded border border-current/30 hover:bg-current/10 active:scale-95 transition-all ${className}`}
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

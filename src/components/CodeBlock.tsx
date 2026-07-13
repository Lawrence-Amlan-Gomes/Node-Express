export default function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden my-4">
      {label && <div className="text-xs text-sublabel px-3.5 py-2 border-b border-border font-mono">{label}</div>}
      <pre className="m-0 p-4 overflow-x-auto">
        <code className="font-mono text-sm leading-relaxed text-cyan-500 whitespace-pre">{children.trim()}</code>
      </pre>
    </div>
  );
}

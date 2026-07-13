export default function FlowChain({ steps }: { steps: string[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap my-3">
      {steps.map((step, i) => (
        <div className="flex items-center gap-2" key={i}>
          <span className="font-mono text-xs bg-surface border border-border rounded-md px-2.5 py-1.5 text-title">{step}</span>
          {i < steps.length - 1 && <span className="text-sublabel">&rarr;</span>}
        </div>
      ))}
    </div>
  );
}

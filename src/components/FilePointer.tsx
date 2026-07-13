export default function FilePointer({ path, note }: { path: string; note?: string }) {
  return (
    <div className="flex gap-3 items-start bg-blue-500/8 border border-blue-500/35 rounded-card px-4 py-3.5 my-4.5">
      <div className="text-lg leading-none">📁</div>
      <div className="min-w-0">
        <div className="text-title text-sm font-semibold">
          Open{" "}
          <code className="text-blue-500 bg-blue-500/12 px-1.5 py-0.5 rounded font-mono text-xs break-all">{path}</code>
        </div>
        {note && <p className="mt-1.5 mb-0 text-sublabel text-xs">{note}</p>}
      </div>
    </div>
  );
}

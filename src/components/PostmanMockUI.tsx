"use client"; // needs local state for which saved request is currently selected

import { useState } from "react";

const methodColor: Record<string, string> = {
  GET: "text-green-500",
  POST: "text-orange-500",
};

const statusColor = (status: number) => {
  if (status >= 200 && status < 300) return "text-green-500 border-green-500/40 bg-green-500/10";
  if (status >= 400) return "text-red-500 border-red-500/40 bg-red-500/10";
  return "text-yellow-500 border-yellow-500/40 bg-yellow-500/10";
};

interface SavedRequest {
  name: string;
  method: "GET" | "POST";
  path: string;
  requestBody?: string;
  status: number;
  responseBody: string;
}

// This mock mirrors the exact real requests/responses in
// postman-collection.json and demo.js in this section's example folder —
// every status code and response body here is a genuinely verified real
// result from running that API, not invented for the screenshot.
const requests: SavedRequest[] = [
  {
    name: "Get all todos",
    method: "GET",
    path: "/todos",
    status: 200,
    responseBody: JSON.stringify(
      [
        { id: 1, text: "Learn Express routing", done: true },
        { id: 2, text: "Learn the middleware pipeline", done: true },
        { id: 3, text: "Learn how to explore an API manually", done: false },
      ],
      null,
      2
    ),
  },
  {
    name: "Get one todo by id",
    method: "GET",
    path: "/todos/2",
    status: 200,
    responseBody: JSON.stringify({ id: 2, text: "Learn the middleware pipeline", done: true }, null, 2),
  },
  {
    name: "Create a new todo",
    method: "POST",
    path: "/todos",
    requestBody: JSON.stringify({ text: "Try sending this request for real" }, null, 2),
    status: 201,
    responseBody: JSON.stringify({ id: 4, text: "Try sending this request for real", done: false }, null, 2),
  },
  {
    name: "Get a todo that doesn't exist (real 404)",
    method: "GET",
    path: "/todos/999",
    status: 404,
    responseBody: JSON.stringify({ error: "not found" }, null, 2),
  },
];

// A static, hand-built illustration of the real Postman desktop app's
// layout — NOT live software running here (Postman is a separate app you'd
// install yourself; this project can't embed or drive it). Every value
// shown (status codes, response bodies) is the exact real result already
// verified by running demo.js in this same folder — only the surrounding
// chrome is illustrative, nothing in the data is invented.
export default function PostmanMockUI() {
  const [selected, setSelected] = useState(0);
  const active = requests[selected];

  return (
    <div className="rounded-card overflow-hidden border border-border my-3 bg-[#1a1a1a] text-sm">
      {/* Postman's real top bar is this dark, with its logo in the signature orange */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#141414] border-b border-black/40">
        <span className="w-3 h-3 rounded-sm bg-orange-500" />
        <span className="text-white/90 font-semibold text-xs">Postman</span>
        <span className="text-white/40 text-xs ml-2">Exploring the API — Node + Express Playground</span>
      </div>

      <div className="flex min-h-80">
        {/* Sidebar: the saved collection, exactly as postman-collection.json describes it */}
        <div className="w-56 shrink-0 bg-[#1e1e1e] border-r border-black/40 py-2">
          <div className="px-3 py-1.5 text-white/40 text-[11px] uppercase tracking-wide">Collections</div>
          <div className="px-3 py-1 text-white/70 text-xs font-medium mb-1">Exploring the API</div>
          {requests.map((req, i) => (
            <button
              key={req.name}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-white/5 ${i === selected ? "bg-white/10" : ""}`}
            >
              <span className={`font-mono text-[10px] font-bold w-9 shrink-0 ${methodColor[req.method]}`}>{req.method}</span>
              <span className="text-white/70 text-xs truncate">{req.name}</span>
            </button>
          ))}
        </div>

        {/* Main panel: URL bar + Send button (Postman's real button color) + response */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-black/40">
            <span className={`font-mono text-xs font-bold px-2 py-1 rounded bg-white/5 ${methodColor[active.method]}`}>{active.method}</span>
            <span className="text-white/70 font-mono text-xs truncate flex-1">http://localhost:4011{active.path}</span>
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-1.5 rounded">Send</button>
          </div>

          {active.requestBody && (
            <div className="px-3 py-2 border-b border-black/40">
              <div className="text-white/40 text-[11px] uppercase tracking-wide mb-1">Body (raw JSON)</div>
              <pre className="font-mono text-xs text-white/70 whitespace-pre-wrap">{active.requestBody}</pre>
            </div>
          )}

          <div className="px-3 py-2 flex items-center gap-2 border-b border-black/40">
            <span className="text-white/40 text-[11px] uppercase tracking-wide">Response</span>
            <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${statusColor(active.status)}`}>{active.status}</span>
          </div>
          <pre className="flex-1 px-3 py-2.5 font-mono text-xs text-white/80 whitespace-pre-wrap overflow-auto">{active.responseBody}</pre>
        </div>
      </div>
    </div>
  );
}

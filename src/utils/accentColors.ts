// Single lookup for every dynamic semantic color (stage accents, learner
// status, comparison tones). Tailwind needs complete literal class names, so
// dynamic colors are never built by string concatenation.

export type AccentKey = "blue" | "purple" | "orange" | "yellow" | "green" | "red" | "cyan" | "muted";

interface AccentClasses {
  text: string;
  bg: string;
  border: string;
  borderTop: string;
}

export const accent: Record<AccentKey, AccentClasses> = {
  blue: { text: "text-blue-500", bg: "bg-blue-500", border: "border-blue-500", borderTop: "border-t-blue-500" },
  purple: { text: "text-purple-500", bg: "bg-purple-500", border: "border-purple-500", borderTop: "border-t-purple-500" },
  orange: { text: "text-orange-500", bg: "bg-orange-500", border: "border-orange-500", borderTop: "border-t-orange-500" },
  yellow: { text: "text-yellow-500", bg: "bg-yellow-500", border: "border-yellow-500", borderTop: "border-t-yellow-500" },
  green: { text: "text-green-500", bg: "bg-green-500", border: "border-green-500", borderTop: "border-t-green-500" },
  red: { text: "text-red-500", bg: "bg-red-500", border: "border-red-500", borderTop: "border-t-red-500" },
  cyan: { text: "text-cyan-500", bg: "bg-cyan-500", border: "border-cyan-500", borderTop: "border-t-cyan-500" },
  muted: { text: "text-muted", bg: "bg-muted", border: "border-muted", borderTop: "border-t-muted" },
};

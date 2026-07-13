import { accent } from "@/utils/accentColors";

const toneColorKey = {
  good: "green",
  caution: "yellow",
  bad: "red",
} as const;

export default function ComparisonCard({
  title,
  tone,
  points,
}: {
  title: string;
  tone: keyof typeof toneColorKey;
  points: string[];
}) {
  const colors = accent[toneColorKey[tone] ?? "cyan"];
  return (
    <div className={`bg-surface border-x border-b border-border border-t-2 rounded-card px-4 py-3.5 ${colors.borderTop}`}>
      <h4 className={`m-0 mb-2 text-sm font-mono ${colors.text}`}>{title}</h4>
      <ul className="m-0 pl-4.5">
        {points.map((point, i) => (
          <li key={i} className="text-body text-xs mb-1">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

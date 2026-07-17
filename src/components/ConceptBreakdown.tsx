import { accent, type AccentKey } from "@/utils/accentColors";

export interface ConceptBreakdownItem {
  label: string;
  description: string;
  example?: string;
}

// A numbered "1. Bold Label / plain description / Example: ..." block —
// the easy-vocabulary breakdown shape used across the detail-rebuild pass.
// See co-founder/build-conventions.md.
export default function ConceptBreakdown({
  items,
  accent: accentKey = "blue",
}: {
  items: ConceptBreakdownItem[];
  accent?: AccentKey;
}) {
  const colors = accent[accentKey];
  return (
    <div className="my-4 flex flex-col gap-3.5">
      {items.map((item, i) => (
        <div key={item.label} className="rounded-card border border-border bg-surface px-4 py-3">
          <h4 className={`m-0 mb-1.5 text-sm font-semibold ${colors.text}`}>
            {i + 1}. {item.label}
          </h4>
          <p className="m-0 text-body text-sm leading-relaxed">{item.description}</p>
          {item.example && (
            <p className="m-0 mt-1.5 text-sublabel text-sm leading-relaxed">
              <span className="font-semibold">Example:</span> {item.example}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

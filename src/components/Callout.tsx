import type { ReactNode } from "react";
import { accent, type AccentKey } from "@/utils/accentColors";

// A small titled summary box — used for a closing "The Bottom Line" wrap-up
// at the end of a rewritten section. See co-founder/build-conventions.md.
export default function Callout({
  title,
  children,
  accent: accentKey = "cyan",
}: {
  title: string;
  children: ReactNode;
  accent?: AccentKey;
}) {
  const colors = accent[accentKey];
  return (
    <div className={`bg-surface border-x border-b border-border border-t-2 rounded-card px-4 py-3.5 my-4 ${colors.borderTop}`}>
      <h4 className={`m-0 mb-1.5 text-sm font-semibold ${colors.text}`}>{title}</h4>
      <p className="m-0 text-body text-sm leading-relaxed">{children}</p>
    </div>
  );
}

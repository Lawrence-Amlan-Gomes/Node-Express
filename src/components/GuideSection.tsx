import { accent, type AccentKey } from "@/utils/accentColors";
import type { ReactNode } from "react";

export default function GuideSection({
  number,
  title,
  accent: accentKey = "blue",
  children,
}: {
  number: number;
  title: string;
  accent?: AccentKey;
  children: ReactNode;
}) {
  const colors = accent[accentKey];
  return (
    <section className="mb-12 pb-10 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-center gap-3.5 mb-4">
        <span
          className={`w-8 h-8 shrink-0 border rounded-full flex items-center justify-center font-mono font-bold text-sm ${colors.text} ${colors.border}`}
        >
          {number}
        </span>
        <h3 className="m-0 text-xl">{title}</h3>
      </div>
      <div className="[&>p]:text-body [&>p]:text-sm [&>p+p]:mt-3">{children}</div>
    </section>
  );
}

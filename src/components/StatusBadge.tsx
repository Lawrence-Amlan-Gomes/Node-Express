import { statusColorKey, statusLabel, type TopicStatus } from "@/data/curriculum";
import { accent } from "@/utils/accentColors";

export default function StatusBadge({ status }: { status: TopicStatus }) {
  const colors = accent[statusColorKey[status]];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full border bg-white/3 ${colors.text} ${colors.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.bg}`} />
      {statusLabel[status]}
    </span>
  );
}

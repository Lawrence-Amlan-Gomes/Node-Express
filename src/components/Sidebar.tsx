"use client";

// This component needs "use client" because it calls usePathname() to know
// which link is active right now — that's browser/interaction state, and
// only Client Components can read it. Every other page in this app renders
// on the server by default; this sidebar is the one deliberate exception.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stages, statusColorKey } from "@/data/curriculum";
import { accent } from "@/utils/accentColors";
import NodeLogo from "@/components/NodeLogo";

function StatusDot({ status }: { status: keyof typeof statusColorKey }) {
  return <span className={`w-1.75 h-1.75 rounded-full shrink-0 mt-1.5 ${accent[statusColorKey[status]].bg}`} />;
}

const linkBase =
  "flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-body text-sm leading-snug border-l-2 border-transparent hover:bg-surface-raised hover:text-title hover:no-underline";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-65 shrink-0 h-screen sticky top-0 overflow-y-auto bg-surface border-r border-border flex flex-col">
      <div className="flex items-center gap-2.5 px-4.5 py-5 border-b border-border">
        <NodeLogo className="w-7 h-7 shrink-0 rounded-full border border-border" />
        <div>
          <div className="text-title font-semibold text-sm leading-tight">Node + Express Playground</div>
          <div className="text-sublabel text-xs">Beginner → Advanced</div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 pt-3.5 pb-6">
        <div className="pb-3.5 mb-2.5 border-b border-border flex flex-col gap-0.5">
          <Link
            href="/"
            className={`${linkBase} ${pathname === "/" ? "bg-surface-raised text-title font-semibold border-l-blue-500" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/roadmap"
            className={`${linkBase} ${pathname === "/roadmap" ? "bg-surface-raised text-title font-semibold border-l-blue-500" : ""}`}
          >
            RoadMap
          </Link>
        </div>

        {stages.map((stage) => (
          <div className="mb-4.5" key={stage.id}>
            <div className="text-sublabel text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1.5">
              {stage.label}
            </div>
            {stage.topics.map((topic) => {
              const href = `/topics/${topic.slug}`;
              const isActive = pathname === href;
              const colors = accent[stage.color];
              return (
                <Link
                  key={topic.slug}
                  href={href}
                  className={`${linkBase} ${isActive ? `bg-surface-raised text-title font-semibold ${colors.border}` : ""}`}
                >
                  <StatusDot status={topic.status} />
                  <span className="min-w-0 wrap-break-word line-clamp-2">{topic.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

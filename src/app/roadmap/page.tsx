import Link from "next/link";
import { stages } from "@/data/curriculum";
import StatusBadge from "@/components/StatusBadge";
import { accent } from "@/utils/accentColors";

export default function RoadMap() {
  return (
    <div>
      <h1>RoadMap</h1>
      <p className="text-sublabel text-sm max-w-160 mb-9">
        Your journey, in chronological order. Each phase builds on the one before it — click any
        topic to open its study guide.
      </p>

      <div className="flex flex-col">
        {stages.map((stage, stageIndex) => {
          const colors = accent[stage.color];
          return (
            <div className="flex gap-5" key={stage.id}>
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-8.5 h-8.5 rounded-full bg-surface border flex items-center justify-center font-mono font-bold text-sm ${colors.text} ${colors.border}`}
                >
                  {stageIndex + 1}
                </div>
                {stageIndex < stages.length - 1 && <div className="flex-1 w-0.5 bg-border my-1" />}
              </div>
              <div className="pb-8 flex-1">
                <h3 className="mt-1 mb-3.5 text-base">{stage.label}</h3>
                <div className="flex flex-col gap-2">
                  {stage.topics.map((topic) => (
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="flex justify-between items-center bg-surface border border-border rounded-lg px-3.5 py-2.5 text-body text-sm hover:border-blue-500 hover:text-title hover:no-underline"
                      key={topic.slug}
                    >
                      <span>{topic.title}</span>
                      <StatusBadge status={topic.status} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

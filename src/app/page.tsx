import Link from "next/link";
import { stages, getAllTopics } from "@/data/curriculum";
import StatusBadge from "@/components/StatusBadge";

export default function Dashboard() {
  const topics = getAllTopics();
  const total = topics.length;
  const mastered = topics.filter((t) => t.status === "mastered").length;
  const percent = total === 0 ? 0 : Math.round((mastered / total) * 100);
  const current = topics.find((t) => t.status === "in-progress");

  return (
    <div>
      <h1>Welcome back</h1>
      <p className="text-sublabel text-sm max-w-160 mb-8">
        This is your hands-on playground for learning Node.js + Express — from the event loop to a
        senior-level backend interview. Every nav item on the left is a phase of your journey, in
        the order you&apos;ll tackle them.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-10">
        <div className="bg-surface border border-border rounded-card px-5 py-4.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-2.5">Overall Progress</div>
          <div className="text-2xl font-bold mb-2 text-green-500">{percent}%</div>
          <div className="h-1.5 bg-surface-raised rounded overflow-hidden mb-2">
            <div className="h-full bg-green-500 rounded" style={{ width: `${percent}%` }} />
          </div>
          <div className="text-sublabel text-xs">
            {mastered} of {total} topics mastered
          </div>
        </div>

        <div className="bg-surface border border-border rounded-card px-5 py-4.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-2.5">Currently Learning</div>
          {current ? (
            <>
              <div className="text-2xl font-bold mb-2 text-yellow-500">{current.title}</div>
              <Link className="text-xs font-semibold hover:no-underline" href={`/topics/${current.slug}`}>
                Jump back in &rarr;
              </Link>
            </>
          ) : (
            <div className="text-sublabel text-xs">Nothing in progress yet.</div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-card px-5 py-4.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-2.5">Phases</div>
          <div className="text-2xl font-bold mb-2 text-blue-500">{stages.length}</div>
          <div className="text-sublabel text-xs">Foundations through Interview Prep</div>
        </div>
      </div>

      <h2 className="text-base mb-4">Phase Breakdown</h2>
      <div className="flex flex-col gap-3">
        {stages.map((stage) => {
          const phaseMastered = stage.topics.filter((t) => t.status === "mastered").length;
          return (
            <div className="bg-surface border border-border rounded-card px-4.5 py-3.5" key={stage.id}>
              <div className="flex justify-between text-title font-semibold text-sm mb-2.5">
                <span>{stage.label}</span>
                <span className="text-sublabel font-normal font-mono text-xs">
                  {phaseMastered}/{stage.topics.length}
                </span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-2">
                {stage.topics.map((topic) => (
                  <li className="flex justify-between items-center text-xs" key={topic.slug}>
                    <Link className="hover:no-underline" href={`/topics/${topic.slug}`}>
                      {topic.title}
                    </Link>
                    <StatusBadge status={topic.status} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

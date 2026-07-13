import Link from "next/link";
import { stages, getTopicBySlug } from "@/data/curriculum";

// Dynamic catch-all: any topic slug that does NOT have its own literal folder
// (e.g. src/app/topics/what-is-nodejs/) lands here instead. Next.js always
// prefers an exact static route over a dynamic one, so once a topic gets its
// own page.tsx file, it silently "graduates" out of this stub with zero
// changes needed here.
export default async function StubTopic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return (
      <div>
        <h1>Not Found</h1>
        <p>
          That topic doesn&apos;t exist yet. Head back to the <Link href="/roadmap">RoadMap</Link>.
        </p>
      </div>
    );
  }

  const stage = stages.find((s) => s.topics.some((t) => t.slug === slug))!;
  const siblings = stage.topics;
  const currentIndex = siblings.findIndex((t) => t.slug === slug);
  const previous = siblings[currentIndex - 1];

  return (
    <div>
      <div className="text-sublabel text-xs uppercase tracking-wide mb-1">{stage.label}</div>
      <h1>{topic.title}</h1>
      <div className="bg-surface border border-dashed border-border rounded-card p-8 text-center mt-6">
        <div className="text-3xl mb-3">🔒</div>
        <h3 className="text-base">This guide hasn&apos;t been written yet</h3>
        <p className="text-sublabel text-sm max-w-115 mt-2.5 mx-auto">
          Topics get their full step-by-step guide as we actually reach them in the roadmap — that
          keeps the pace matched to where you really are, instead of front-loading content
          you&apos;re not ready for yet.
        </p>
        {previous && (
          <p className="text-body text-sm max-w-115 mt-2.5 mx-auto">
            Finish <Link href={`/topics/${previous.slug}`}>{previous.title}</Link> first, then tell
            your mentor you&apos;re ready to move on.
          </p>
        )}
        <Link href="/roadmap" className="inline-block mt-5 text-xs font-semibold">
          &larr; Back to RoadMap
        </Link>
      </div>
    </div>
  );
}

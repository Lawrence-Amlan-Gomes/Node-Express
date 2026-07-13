import type { ReactNode } from "react";
import GuideSection from "./GuideSection";
import FilePointer from "./FilePointer";
import TerminalFrame from "./TerminalFrame";
import type { AccentKey } from "@/utils/accentColors";

export interface StudySection {
  heading: string;
  paragraphs: string[];
  extra?: ReactNode;
  filePointer?: { path: string; note?: string };
  filePointers?: { path: string; note?: string }[];
  demo?: ReactNode;
  demoCommand?: string; // the real command actually run to produce the demo's output, e.g. "node event-loop-order.js"
  demoSelfFramed?: boolean;
}

export default function StudyPage({
  title,
  stageLabel,
  stageColor,
  intro,
  sections,
}: {
  title: string;
  stageLabel: string;
  stageColor: AccentKey;
  intro?: string;
  sections: StudySection[];
}) {
  return (
    <div>
      <div className="text-sublabel text-xs uppercase tracking-wide mb-1">{stageLabel}</div>
      <h2 className="text-2xl">{title}</h2>
      {intro && <p className="text-sublabel text-sm max-w-160 mb-8">{intro}</p>}

      {sections.map((section, i) => (
        <GuideSection key={i} number={i + 1} title={section.heading} accent={stageColor}>
          {section.paragraphs.map((para, j) => (
            <p key={j}>{para}</p>
          ))}
          {section.extra}
          {section.filePointer && <FilePointer path={section.filePointer.path} note={section.filePointer.note} />}
          {section.filePointers?.map((fp, j) => (
            <FilePointer key={j} path={fp.path} note={fp.note} />
          ))}
          {section.demo && (
            <>
              <div className="text-xs uppercase tracking-wide text-green-500 font-bold mt-5 mb-2.5">Live Output from Real Code</div>
              {section.demoSelfFramed ? (
                section.demo
              ) : (
                <TerminalFrame command={section.demoCommand ?? ""}>{section.demo}</TerminalFrame>
              )}
            </>
          )}
        </GuideSection>
      ))}
    </div>
  );
}

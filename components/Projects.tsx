"use client";

import { useEffect, useState } from "react";
import { FolderKanban, ExternalLink, ArrowRight } from "lucide-react";
import type { ProjectItem } from "@/lib/resume";
import Reveal from "@/components/Reveal";

type ProjectsProps = {
  projects: ProjectItem[];
};

export default function Projects({ projects }: ProjectsProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [raisedIds, setRaisedIds] = useState<string[]>([]);

  useEffect(() => {
    setRaisedIds((current) => {
      const next = new Set(current);
      if (activeCardId) next.add(activeCardId);
      return [...next];
    });

    const timer = window.setTimeout(() => {
      setRaisedIds(activeCardId ? [activeCardId] : []);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [activeCardId]);

  if (!projects.length) return null;

  return (
    <section id="projects" className="robot-grid overflow-x-clip border-b border-border py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="section-label mb-3 flex items-center gap-2">
            <FolderKanban className="h-3.5 w-3.5" aria-hidden />
            Projects
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide md:text-3xl">
            Selected builds
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {projects.map((project, index) => {
            const cardId = `${project.title}-${index}`;
            const isFlipped = activeCardId === cardId;

            return (
              <article
                key={cardId}
                className={`pcard ${isFlipped ? "is-flipped" : ""} ${raisedIds.includes(cardId) ? "is-raised" : ""}`}
              >
                <div className="pcard-inner">
                  <div
                    className="pcard-face pcard-front hud-frame"
                    inert={isFlipped}
                    aria-hidden={isFlipped}
                    onClick={() => setActiveCardId(cardId)}
                  >
                    <div className="flex h-full cursor-pointer flex-col items-start justify-center gap-5 p-6 md:p-7">
                      <h3 className="font-[family-name:var(--font-display)] text-xl leading-snug tracking-wide md:text-2xl">
                        {project.title}
                      </h3>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 border-b border-red/70 pb-0.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-red"
                        onClick={() => setActiveCardId(cardId)}
                        aria-expanded={isFlipped}
                      >
                        View details
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div
                    className="pcard-face pcard-back hud-frame"
                    inert={!isFlipped}
                    aria-hidden={!isFlipped}
                    onClick={() => setActiveCardId(null)}
                  >
                    <div className="flex h-full cursor-pointer flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-[family-name:var(--font-display)] text-base leading-snug tracking-wide md:text-lg">
                          {project.title}
                        </h3>
                        <button
                          type="button"
                          className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-red"
                          onClick={() => setActiveCardId(null)}
                        >
                          Close
                        </button>
                      </div>

                      {project.stack ? (
                        <p className="mt-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-red">
                          {project.stack}
                        </p>
                      ) : null}

                      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                        {project.summary ? (
                          <p className="text-sm leading-relaxed text-muted">
                            {project.summary}
                          </p>
                        ) : null}
                        {project.highlights.length > 0 ? (
                          <ul className="mt-3 space-y-2">
                            {project.highlights.map((highlight) => (
                              <li
                                key={highlight}
                                className="flex gap-2 text-sm text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:bg-red before:content-['']"
                              >
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex w-fit items-center gap-2 bg-red px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-white hover:bg-red-dim"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Open project
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

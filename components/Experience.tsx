import { Briefcase, Building2, Calendar } from "lucide-react";
import type { ExperienceItem } from "@/lib/resume";
import Reveal from "@/components/Reveal";

type ExperienceProps = {
  experience: ExperienceItem[];
};

export default function Experience({ experience }: ExperienceProps) {
  if (!experience.length) return null;

  return (
    <section id="experience" className="border-b border-border py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="section-label mb-3 flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5" aria-hidden />
            Experience
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide md:text-3xl">
            Work history
          </h2>
        </Reveal>
        <ol className="mt-10 space-y-6">
          {experience.map((job, index) => (
            <Reveal key={`${job.company}-${job.title}`} delayMs={index * 100}>
              <li className="hud-frame hover-lift p-5 md:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-text">
                      {job.title}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-2 text-sm text-red">
                      <Building2 className="h-4 w-4" aria-hidden />
                      {job.company}
                    </p>
                  </div>
                  <p className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-muted">
                    <Calendar className="h-3.5 w-3.5 text-red" aria-hidden />
                    {job.dates}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>
                {job.summary ? (
                  <p className="mt-3 text-sm text-muted md:text-base">
                    {job.summary}
                  </p>
                ) : null}
                {job.highlights.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {job.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-2 text-sm text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:bg-red before:content-['']"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

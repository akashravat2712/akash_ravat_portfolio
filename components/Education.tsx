import { GraduationCap, School, Calendar } from "lucide-react";
import type { EducationItem } from "@/lib/resume";
import Reveal from "@/components/Reveal";

type EducationProps = {
  education: EducationItem[];
};

export default function Education({ education }: EducationProps) {
  if (!education.length) return null;

  return (
    <section id="education" className="border-b border-border py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="section-label mb-3 flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden />
            Education
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide md:text-3xl">
            Academic path
          </h2>
        </Reveal>
        <ul className="mt-10 grid items-stretch gap-4 md:grid-cols-2">
          {education.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 100} className="h-full">
              <li className="hud-frame hover-lift flex h-full items-start justify-between gap-4 p-5">
                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-display)] text-base tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-sm text-red">
                    <School className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {item.school}
                  </p>
                </div>
                {item.dates || item.details ? (
                  <div className="flex shrink-0 items-start gap-1.5">
                    {item.dates ? (
                      <Calendar
                        className="mt-px h-3.5 w-3.5 shrink-0 text-muted"
                        aria-hidden
                      />
                    ) : null}
                    <div className="flex flex-col items-center">
                      {item.dates ? (
                        <p className="whitespace-nowrap font-[family-name:var(--font-mono)] text-xs uppercase leading-none tracking-wider text-muted">
                          {item.dates}
                        </p>
                      ) : null}
                      {item.details ? (
                        <p className="mt-1 whitespace-nowrap font-[family-name:var(--font-mono)] text-[11px] leading-none tracking-wide text-red">
                          {item.details}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

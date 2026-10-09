import {
  Code2,
  Brain,
  Database,
  Bot,
  Wrench,
  Layers,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import type { SkillGroup } from "@/lib/resume";
import Reveal from "@/components/Reveal";

type SkillsProps = {
  skills: SkillGroup[];
};

function iconForGroup(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (t.includes("database")) return Database;
  if (
    t.includes("machine") ||
    t.includes("nlp") ||
    t.includes("deep") ||
    t.includes("llm") ||
    t.includes("ai")
  )
    return Brain;
  if (t.includes("tool") || t.includes("platform")) return Wrench;
  if (t.includes("web") || t.includes("backend") || t.includes("framework"))
    return Layers;
  if (t.includes("program")) return Code2;
  return Bot;
}

function isToolsGroup(title: string): boolean {
  const t = title.toLowerCase();
  return t.includes("tool") || t.includes("platform");
}

export default function Skills({ skills }: SkillsProps) {
  if (!skills.length) return null;

  const regular = skills.filter((g) => !isToolsGroup(g.title));
  const tools = skills.filter((g) => isToolsGroup(g.title));

  return (
    <section id="skills" className="robot-grid border-b border-border py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="section-label mb-3 flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5" aria-hidden />
            Skills
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide md:text-3xl">
            Technical stack
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regular.map((group, index) => {
            const Icon = iconForGroup(group.title);
            return (
              <Reveal key={group.title} delayMs={index * 60}>
                <article className="hud-frame hover-lift h-full border border-border bg-bg-panel/80 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-red" aria-hidden />
                    <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-text">
                      {group.title}
                    </h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border border-border bg-bg px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] text-muted transition hover:border-red/50 hover:text-text"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        {tools.map((group, index) => {
          const Icon = iconForGroup(group.title);
          return (
            <Reveal key={group.title} delayMs={120 + index * 60} className="mt-4">
              <article className="hud-frame hover-lift w-full border border-border bg-bg-panel/80 p-5 md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-red" aria-hidden />
                  <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-text md:text-sm">
                    {group.title}
                  </h3>
                </div>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border border-border bg-bg px-3 py-2.5 text-center font-[family-name:var(--font-mono)] text-xs text-muted transition hover:border-red/50 hover:text-text md:text-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

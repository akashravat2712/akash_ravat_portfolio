import { ArrowRight, Download } from "lucide-react";
import type { ResumeFrontmatter } from "@/lib/resume";
import RotatingRole from "@/components/RotatingRole";
import HeroOrbit from "@/components/HeroOrbit";

type HeroProps = {
  frontmatter: ResumeFrontmatter;
  orbitLabels: string[];
};

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (parts[0] ?? "").slice(0, 2).toUpperCase();
}

export default function Hero({ frontmatter, orbitLabels }: HeroProps) {
  const { name } = frontmatter;

  return (
    <section
      id="top"
      className="robot-grid relative overflow-x-clip border-b border-border"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,6,0,0.18),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-6 md:py-24">
        <div className="animate-fade-up text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-wide text-text sm:text-5xl md:text-6xl">
            {name}
          </h1>
          <RotatingRole />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-red px-5 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-white transition duration-300 hover:scale-105 hover:bg-red-dim"
            >
              View projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="/Akash_Ravat_resume.pdf"
              download="Akash_Ravat_resume.pdf"
              className="inline-flex items-center gap-2 border border-red/50 bg-red/10 px-5 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-red transition duration-300 hover:scale-105 hover:bg-red hover:text-white"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-border px-5 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-text transition duration-300 hover:scale-105 hover:border-red hover:text-red"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="animate-fade-up relative mx-auto w-full max-w-lg [animation-delay:180ms]">
          <HeroOrbit initials={initialsFrom(name)} labels={orbitLabels} />
        </div>
      </div>
    </section>
  );
}

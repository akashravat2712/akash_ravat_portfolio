import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Bot,
  Send,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ResumeData } from "@/lib/resume";

type FooterProps = {
  data: ResumeData;
};

export default function Footer({ data }: FooterProps) {
  const { frontmatter, contact } = data;
  const githubUrl = frontmatter.github
    ? `https://github.com/${frontmatter.github}`
    : "";
  const linkedinUrl = frontmatter.linkedin
    ? `https://www.linkedin.com/in/${frontmatter.linkedin}`
    : "";

  return (
    <footer id="contact" className="border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
        <Reveal>
          <p className="section-label mb-3 flex items-center gap-2">
            <Bot className="h-3.5 w-3.5" aria-hidden />
            Contact
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide md:text-3xl">
            Contact
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-muted">
            {frontmatter.location ? (
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-red" aria-hidden />
                {frontmatter.location}
              </li>
            ) : null}
            {frontmatter.email ? (
              <li>
                <a
                  href={`mailto:${frontmatter.email}`}
                  className="inline-flex items-center gap-3 hover:text-red"
                >
                  <Mail className="h-4 w-4 text-red" aria-hidden />
                  {frontmatter.email}
                </a>
              </li>
            ) : null}
            {frontmatter.phone ? (
              <li>
                <a
                  href={`tel:${frontmatter.phone}`}
                  className="inline-flex items-center gap-3 hover:text-red"
                >
                  <Phone className="h-4 w-4 text-red" aria-hidden />
                  {frontmatter.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </Reveal>
        <Reveal delayMs={120}>
          <div className="hud-frame hover-lift flex h-full flex-col p-5 md:p-6">
            <p className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-red">
              Connect
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
              Connect with me
            </h3>
            {contact ? (
              <p className="mt-4 text-sm text-muted md:text-base">{contact}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center border border-border text-muted transition hover:border-red hover:text-red"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              ) : null}
              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center border border-border text-muted transition hover:border-red hover:text-red"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              ) : null}
              {frontmatter.phone ? (
                <a
                  href={`tel:${frontmatter.phone}`}
                  className="inline-flex h-11 w-11 items-center justify-center border border-border text-muted transition hover:border-red hover:text-red"
                  aria-label="Call"
                >
                  <Phone className="h-5 w-5" />
                </a>
              ) : null}
              {frontmatter.email ? (
                <a
                  href={`mailto:${frontmatter.email}`}
                  className="inline-flex h-11 w-11 items-center justify-center border border-border text-muted transition hover:border-red hover:text-red"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              ) : null}
            </div>
            {frontmatter.email ? (
              <a
                href={`mailto:${frontmatter.email}`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-red px-4 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-white transition hover:bg-red-dim"
              >
                <Send className="h-4 w-4" aria-hidden />
                Email
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
      <div className="border-t border-border py-4 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted">
        © {new Date().getFullYear()} {frontmatter.name || "Portfolio"}
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Bot,
  User,
  Cpu,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Mail,
} from "lucide-react";

const links = [
  { href: "#about", label: "Introduction", icon: User },
  { href: "#skills", label: "Skills", icon: Cpu },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#projects", label: "Projects", icon: FolderKanban },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#contact", label: "Contact", icon: Mail },
];

type NavbarProps = {
  name: string;
};

export default function Navbar({ name }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md transition-shadow duration-300">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a
          href="#top"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm tracking-wider text-text transition hover:text-red md:text-base"
        >
          <Bot className="h-5 w-5 text-red transition-transform duration-300 hover:rotate-12" aria-hidden />
          <span>{name || "Portfolio"}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="relative px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-muted transition hover:text-red after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-red after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded border border-border p-2 text-text md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-bg-elevated md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-3 py-3 font-[family-name:var(--font-mono)] text-sm uppercase tracking-wider text-muted hover:text-red"
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4 text-red" aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

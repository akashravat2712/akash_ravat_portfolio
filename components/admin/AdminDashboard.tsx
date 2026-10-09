"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Save,
  LogOut,
  Plus,
  Trash2,
  User,
  FileText,
  Cpu,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  SkillGroup,
} from "@/lib/resume";

type Tab =
  | "profile"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "education";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "about", label: "About", icon: FileText },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "education", label: "Education", icon: GraduationCap },
];

type Props = {
  initial: ResumeData;
};

const fieldClass =
  "w-full border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-red";
const labelClass =
  "mb-1 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted";

export default function AdminDashboard({ initial }: Props) {
  const [data, setData] = useState<ResumeData>(initial);
  const [tab, setTab] = useState<Tab>("profile");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const title = useMemo(
    () => data.frontmatter.name || "Admin",
    [data.frontmatter.name]
  );

  async function save() {
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setStatus("error");
        setErrorMsg(body.error || "Save failed.");
        return;
      }
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setErrorMsg("Network error.");
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  function updateFrontmatter(key: keyof ResumeData["frontmatter"], value: string) {
    setData((prev) => ({
      ...prev,
      frontmatter: { ...prev.frontmatter, [key]: value },
    }));
  }

  function updateSkill(index: number, patch: Partial<SkillGroup>) {
    setData((prev) => {
      const skills = prev.skills.map((g, i) =>
        i === index ? { ...g, ...patch } : g
      );
      return { ...prev, skills };
    });
  }

  function updateExperience(index: number, patch: Partial<ExperienceItem>) {
    setData((prev) => {
      const experience = prev.experience.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      );
      return { ...prev, experience };
    });
  }

  function updateProject(index: number, patch: Partial<ProjectItem>) {
    setData((prev) => {
      const projects = prev.projects.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      );
      return { ...prev, projects };
    });
  }

  function updateEducation(index: number, patch: Partial<EducationItem>) {
    setData((prev) => {
      const education = prev.education.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      );
      return { ...prev, education };
    });
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-40 border-b border-border bg-bg-elevated/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div>
            <p className="section-label">Admin console</p>
            <h1 className="font-[family-name:var(--font-display)] text-lg tracking-wide">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="border border-border px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted hover:text-red"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              className="inline-flex items-center gap-2 bg-red px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-white hover:bg-red-dim disabled:opacity-60"
            >
              {status === "saving" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 border border-border px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted hover:text-red"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
        {(status === "ok" || status === "error") && (
          <div className="border-t border-border px-4 py-2 text-sm md:px-6">
            {status === "ok" ? (
              <p className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="h-4 w-4" /> Saved to content/resume.md
              </p>
            ) : (
              <p className="flex items-center gap-2 text-red">
                <AlertCircle className="h-4 w-4" /> {errorMsg}
              </p>
            )}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="h-fit border border-border bg-bg-panel p-2">
          <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-3 py-2 text-left font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider ${
                  tab === id
                    ? "bg-red/15 text-red"
                    : "text-muted hover:text-text"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="space-y-4">
          {tab === "profile" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Name"],
                  ["role", "Role"],
                  ["location", "Location"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["github", "GitHub username"],
                  ["linkedin", "LinkedIn username"],
                  ["photo", "Photo path"],
                  ["tagline", "Tagline"],
                  ["availability", "Availability"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className={key === "tagline" ? "sm:col-span-2" : ""}>
                  <label className={labelClass}>{label}</label>
                  <input
                    className={fieldClass}
                    value={data.frontmatter[key]}
                    onChange={(e) => updateFrontmatter(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "about" && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>About</label>
                <textarea
                  rows={8}
                  className={fieldClass}
                  value={data.about}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, about: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Contact blurb</label>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={data.contact}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, contact: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {tab === "skills" && (
            <div className="space-y-4">
              {data.skills.map((group, index) => (
                <div key={index} className="border border-border bg-bg-panel p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <input
                      className={fieldClass}
                      value={group.title}
                      onChange={(e) =>
                        updateSkill(index, { title: e.target.value })
                      }
                      placeholder="Group title"
                    />
                    <button
                      type="button"
                      className="p-2 text-muted hover:text-red"
                      aria-label="Delete skill group"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <label className={labelClass}>Items (one per line)</label>
                  <textarea
                    rows={5}
                    className={fieldClass}
                    value={group.items.join("\n")}
                    onChange={(e) =>
                      updateSkill(index, {
                        items: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted hover:text-red"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, { title: "New group", items: [] }],
                  }))
                }
              >
                <Plus className="h-4 w-4" /> Add skill group
              </button>
            </div>
          )}

          {tab === "experience" && (
            <div className="space-y-4">
              {data.experience.map((job, index) => (
                <div key={index} className="space-y-3 border border-border bg-bg-panel p-4">
                  <div className="flex justify-between">
                    <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-red">
                      Role {index + 1}
                    </p>
                    <button
                      type="button"
                      className="text-muted hover:text-red"
                      aria-label="Delete experience"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          experience: prev.experience.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {(
                    [
                      ["title", "Job title"],
                      ["company", "Company"],
                      ["dates", "Dates"],
                      ["location", "Location"],
                      ["summary", "Summary"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        className={fieldClass}
                        value={job[key]}
                        onChange={(e) =>
                          updateExperience(index, { [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <div>
                    <label className={labelClass}>Highlights (one per line)</label>
                    <textarea
                      rows={4}
                      className={fieldClass}
                      value={job.highlights.join("\n")}
                      onChange={(e) =>
                        updateExperience(index, {
                          highlights: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted hover:text-red"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    experience: [
                      ...prev.experience,
                      {
                        title: "New role",
                        company: "",
                        dates: "",
                        location: "",
                        summary: "",
                        highlights: [],
                      },
                    ],
                  }))
                }
              >
                <Plus className="h-4 w-4" /> Add experience
              </button>
            </div>
          )}

          {tab === "projects" && (
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index} className="space-y-3 border border-border bg-bg-panel p-4">
                  <div className="flex justify-between">
                    <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-red">
                      Project {index + 1}
                    </p>
                    <button
                      type="button"
                      className="text-muted hover:text-red"
                      aria-label="Delete project"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          projects: prev.projects.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {(
                    [
                      ["title", "Title"],
                      ["url", "URL"],
                      ["stack", "Stack"],
                      ["summary", "Summary"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        className={fieldClass}
                        value={project[key]}
                        onChange={(e) =>
                          updateProject(index, { [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <div>
                    <label className={labelClass}>Highlights (one per line)</label>
                    <textarea
                      rows={3}
                      className={fieldClass}
                      value={project.highlights.join("\n")}
                      onChange={(e) =>
                        updateProject(index, {
                          highlights: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted hover:text-red"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    projects: [
                      ...prev.projects,
                      {
                        title: "New project",
                        url: "",
                        stack: "",
                        summary: "",
                        highlights: [],
                      },
                    ],
                  }))
                }
              >
                <Plus className="h-4 w-4" /> Add project
              </button>
            </div>
          )}

          {tab === "education" && (
            <div className="space-y-4">
              {data.education.map((item, index) => (
                <div key={index} className="space-y-3 border border-border bg-bg-panel p-4">
                  <div className="flex justify-between">
                    <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-red">
                      Education {index + 1}
                    </p>
                    <button
                      type="button"
                      className="text-muted hover:text-red"
                      aria-label="Delete education"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          education: prev.education.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {(
                    [
                      ["title", "Degree / title"],
                      ["school", "School"],
                      ["dates", "Dates"],
                      ["details", "Details"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input
                        className={fieldClass}
                        value={item[key]}
                        onChange={(e) =>
                          updateEducation(index, { [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted hover:text-red"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    education: [
                      ...prev.education,
                      { title: "New entry", school: "", dates: "", details: "" },
                    ],
                  }))
                }
              >
                <Plus className="h-4 w-4" /> Add education
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const RESUME_PATH = path.join(process.cwd(), "content", "resume.md");

export type ResumeFrontmatter = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  photo: string;
  tagline: string;
  availability: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type ExperienceItem = {
  title: string;
  company: string;
  dates: string;
  location: string;
  summary: string;
  highlights: string[];
};

export type ProjectItem = {
  title: string;
  url: string;
  stack: string;
  summary: string;
  highlights: string[];
};

export type EducationItem = {
  title: string;
  school: string;
  dates: string;
  details: string;
};

export type ResumeData = {
  frontmatter: ResumeFrontmatter;
  about: string;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  contact: string;
};

const EMPTY_FRONTMATTER: ResumeFrontmatter = {
  name: "",
  role: "",
  location: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  photo: "/images/portrait.jpg",
  tagline: "",
  availability: "",
};

function splitSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = body.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const title = (nl === -1 ? part : part.slice(0, nl)).trim();
    const content = nl === -1 ? "" : part.slice(nl + 1).trim();
    sections[title] = content;
  }
  return sections;
}

function parseSkillGroups(content: string): SkillGroup[] {
  if (!content.trim()) return [];
  const groups: SkillGroup[] = [];
  const parts = content.split(/^### /m).filter(Boolean);
  for (const part of parts) {
    const lines = part.split("\n");
    const title = lines[0]?.trim() ?? "";
    const items = lines
      .slice(1)
      .map((l) => l.trim())
      .filter((l) => l.startsWith("-"))
      .map((l) => l.replace(/^-\s*/, "").trim())
      .filter((l) => l.length > 0);
    if (title) groups.push({ title, items });
  }
  return groups;
}

function labeledValue(lines: string[], key: string): string {
  const prefix = `- ${key}:`;
  const line = lines.find((l) => l.trim().startsWith(prefix));
  if (!line) return "";
  return line.trim().slice(prefix.length).trim();
}

function parseHighlights(block: string): string[] {
  const marker = /^Highlights:\s*$/m;
  const match = marker.exec(block);
  if (!match) return [];
  const after = block.slice(match.index + match[0].length);
  return after
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

function parseExperience(content: string): ExperienceItem[] {
  if (!content.trim()) return [];
  return content
    .split(/^### /m)
    .filter(Boolean)
    .map((part) => {
      const lines = part.split("\n");
      const title = lines[0]?.trim() ?? "";
      return {
        title,
        company: labeledValue(lines, "company"),
        dates: labeledValue(lines, "dates"),
        location: labeledValue(lines, "location"),
        summary: labeledValue(lines, "summary"),
        highlights: parseHighlights(part),
      };
    })
    .filter((item) => item.title);
}

function parseProjects(content: string): ProjectItem[] {
  if (!content.trim()) return [];
  return content
    .split(/^### /m)
    .filter(Boolean)
    .map((part) => {
      const lines = part.split("\n");
      const title = lines[0]?.trim() ?? "";
      return {
        title,
        url: labeledValue(lines, "url"),
        stack: labeledValue(lines, "stack"),
        summary: labeledValue(lines, "summary"),
        highlights: parseHighlights(part),
      };
    })
    .filter((item) => item.title);
}

function parseEducation(content: string): EducationItem[] {
  if (!content.trim()) return [];
  return content
    .split(/^### /m)
    .filter(Boolean)
    .map((part) => {
      const lines = part.split("\n");
      const title = lines[0]?.trim() ?? "";
      return {
        title,
        school: labeledValue(lines, "school"),
        dates: labeledValue(lines, "dates"),
        details: labeledValue(lines, "details"),
      };
    })
    .filter((item) => item.title);
}

export function parseResumeMarkdown(raw: string): ResumeData {
  const { data, content } = matter(raw);
  const sections = splitSections(content);
  const fm = { ...EMPTY_FRONTMATTER, ...(data as Partial<ResumeFrontmatter>) };

  return {
    frontmatter: {
      name: String(fm.name ?? ""),
      role: String(fm.role ?? ""),
      location: String(fm.location ?? ""),
      email: String(fm.email ?? ""),
      phone: String(fm.phone ?? ""),
      github: String(fm.github ?? ""),
      linkedin: String(fm.linkedin ?? ""),
      photo: String(fm.photo || "/images/portrait.jpg"),
      tagline: String(fm.tagline ?? ""),
      availability: String(fm.availability ?? ""),
    },
    about: (sections.About ?? "").trim(),
    skills: parseSkillGroups(sections.Skills ?? ""),
    experience: parseExperience(sections.Experience ?? ""),
    projects: parseProjects(sections.Projects ?? ""),
    education: parseEducation(sections.Education ?? ""),
    contact: (sections.Contact ?? "").trim(),
  };
}

function escapeYaml(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function serializeLabeled(
  fields: Array<[string, string]>,
  highlights: string[]
): string {
  const lines = fields.map(([k, v]) => `- ${k}: ${v}`);
  const highlightLines =
    highlights.length > 0
      ? ["", "Highlights:", "", ...highlights.map((h) => `- ${h}`)]
      : ["", "Highlights:", "", "-"];
  return [...lines, ...highlightLines].join("\n");
}

export function serializeResume(data: ResumeData): string {
  const fm = data.frontmatter;
  const front = [
    "---",
    `name: "${escapeYaml(fm.name)}"`,
    `role: "${escapeYaml(fm.role)}"`,
    `location: "${escapeYaml(fm.location)}"`,
    `email: "${escapeYaml(fm.email)}"`,
    `phone: "${escapeYaml(fm.phone)}"`,
    `github: "${escapeYaml(fm.github)}"`,
    `linkedin: "${escapeYaml(fm.linkedin)}"`,
    `photo: "${escapeYaml(fm.photo)}"`,
    `tagline: "${escapeYaml(fm.tagline)}"`,
    `availability: "${escapeYaml(fm.availability)}"`,
    "---",
    "",
  ].join("\n");

  const skills = data.skills
    .map((g) => {
      const items =
        g.items.length > 0 ? g.items.map((i) => `- ${i}`).join("\n") : "-";
      return `### ${g.title}\n\n${items}`;
    })
    .join("\n\n");

  const experience = data.experience
    .map((e) => {
      const body = serializeLabeled(
        [
          ["company", e.company],
          ["dates", e.dates],
          ["location", e.location],
          ["summary", e.summary],
        ],
        e.highlights
      );
      return `### ${e.title}\n\n${body}`;
    })
    .join("\n\n");

  const projects = data.projects
    .map((p) => {
      const body = serializeLabeled(
        [
          ["url", p.url],
          ["stack", p.stack],
          ["summary", p.summary],
        ],
        p.highlights
      );
      return `### ${p.title}\n\n${body}`;
    })
    .join("\n\n");

  const education = data.education
    .map((e) => {
      return [
        `### ${e.title}`,
        "",
        `- school: ${e.school}`,
        `- dates: ${e.dates}`,
        `- details: ${e.details}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    front,
    "## About",
    "",
    data.about || "",
    "",
    "## Skills",
    "",
    skills || "### Languages\n\n-",
    "",
    "## Experience",
    "",
    experience || "",
    "",
    "## Projects",
    "",
    projects || "",
    "",
    "## Education",
    "",
    education || "",
    "",
    "## Contact",
    "",
    data.contact || "",
    "",
  ].join("\n");
}

export function readResume(): ResumeData {
  const raw = fs.readFileSync(RESUME_PATH, "utf8");
  return parseResumeMarkdown(raw);
}

export function writeResume(data: ResumeData): void {
  const markdown = serializeResume(data);
  fs.writeFileSync(RESUME_PATH, markdown, "utf8");
}

export function getResumePath(): string {
  return RESUME_PATH;
}

# Akash Ravat — Robotics Portfolio

English-only personal portfolio built with **Next.js (React)**, driven by a single markdown file, with a red/black robotics theme and a password-protected admin console.

## Quick start

```bash
npm install
cp .env.example .env.local
# set ADMIN_PASSWORD in .env.local
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Content

Edit [`content/resume.md`](content/resume.md) by hand, or use `/admin` to update Experience, Projects, Skills, and profile fields. Saves write back to the same markdown file.

Portrait: [`public/images/portrait.jpg`](public/images/portrait.jpg)

## Contact

The footer Connect panel shows the contact note from `content/resume.md` and icon links for GitHub, LinkedIn, phone, and email. Email opens the visitor's mail app with the address from the resume frontmatter.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- `gray-matter` for markdown frontmatter
- Lucide React icons
- Orbitron + IBM Plex fonts

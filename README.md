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

## Contact form

The footer form posts to `/api/contact`.

- Name: 2–60 letters. Email: up to 100 characters. Message: 10–500 characters.
- The same visitor can send 3 messages per 15 minutes.
- Each accepted message is emailed to the address in `content/resume.md`. The first send may require a one-time FormSubmit confirmation in that inbox.
- Optional Resend override: set `RESEND_API_KEY` and `CONTACT_TO` in `.env.local`.
- A copy is also stored in `content/messages.json` (gitignored).

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- `gray-matter` for markdown frontmatter
- Lucide React icons
- Orbitron + IBM Plex fonts

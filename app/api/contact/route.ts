import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readResume } from "@/lib/resume";
import {
  isValidEmail,
  validateContact,
  type ContactErrors,
} from "@/lib/contact";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  botField?: string;
};

type StoredMessage = {
  name: string;
  email: string;
  message: string;
  at: string;
};

const MESSAGES_PATH = path.join(process.cwd(), "content", "messages.json");
const WINDOW_MS = 15 * 60 * 1000;
const MAX_SENDS = 3;
const recentSends = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "local";
  return request.headers.get("x-real-ip") || "local";
}

function tooManySends(ip: string): boolean {
  const now = Date.now();
  const recent = (recentSends.get(ip) || []).filter((at) => now - at < WINDOW_MS);
  if (recent.length >= MAX_SENDS) {
    recentSends.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentSends.set(ip, recent);
  return false;
}

function appendMessage(entry: StoredMessage) {
  let existing: unknown[] = [];
  if (fs.existsSync(MESSAGES_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(MESSAGES_PATH, "utf8")) as unknown[];
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
  }
  existing.push(entry);
  fs.writeFileSync(MESSAGES_PATH, JSON.stringify(existing, null, 2), "utf8");
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

async function deliverEmail(
  to: string,
  entry: StoredMessage,
  origin: string
): Promise<"sent" | "activation" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const subject = `Portfolio contact from ${entry.name}`;
  const text = `From: ${entry.name} <${entry.email}>\n\n${entry.message}`;

  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: entry.email,
        subject,
        text,
      }),
    });
    return res.ok ? "sent" : "failed";
  }

  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: `${origin}/`,
      },
      body: JSON.stringify({
        name: entry.name,
        email: entry.email,
        message: entry.message,
        _subject: subject,
        _replyto: entry.email,
        _template: "table",
        _captcha: "false",
      }),
    }
  );
  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean | string;
    message?: string;
  };
  if (/activation/i.test(data.message || "")) return "activation";
  const success = data.success === true || data.success === "true";
  return res.ok && success ? "sent" : "failed";
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if ((body.botField || "").trim()) {
    return NextResponse.json({ ok: true, delivered: "ignored" });
  }

  const name = oneLine(body.name || "");
  const email = oneLine(body.email || "");
  const message = (body.message || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  const errors: ContactErrors = validateContact({ name, email, message });

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: Object.values(errors)[0], errors },
      { status: 400 }
    );
  }

  if (tooManySends(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const to = oneLine(process.env.CONTACT_TO || readResume().frontmatter.email || "");
  if (!isValidEmail(to)) {
    return NextResponse.json(
      { error: "Contact email is not configured." },
      { status: 500 }
    );
  }

  const entry: StoredMessage = {
    name,
    email,
    message,
    at: new Date().toISOString(),
  };

  try {
    appendMessage(entry);
  } catch {
    return NextResponse.json(
      { error: "Could not store your message." },
      { status: 500 }
    );
  }

  try {
    const origin = request.headers.get("origin") || new URL(request.url).origin;
  const delivered = await deliverEmail(to, entry, origin);
    if (delivered === "sent") {
      return NextResponse.json({ ok: true, delivered: "email" });
    }
    if (delivered === "activation") {
      console.error(
        "FormSubmit sent an activation email to the portfolio inbox. Confirm it once, then submissions will arrive by email."
      );
      return NextResponse.json(
        {
          error:
            "Your message was saved. Email delivery is waiting on a one-time confirmation, so please try again in a few minutes.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Contact email failed", error);
  }

  return NextResponse.json(
    { error: "Could not deliver your message by email. Please try again." },
    { status: 502 }
  );
}

"use client";

import { useState, FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  CONTACT_LIMITS,
  validateContact,
  type ContactErrors,
} from "@/lib/contact";

const fieldClass =
  "w-full border bg-bg px-3 py-2.5 text-sm text-text outline-none focus:border-red";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [botField, setBotField] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [serverErrors, setServerErrors] = useState<ContactErrors>({});

  const errors = validateContact({ name, email, message });
  const visibleErrors: ContactErrors = {
    name:
      touched.name || name
        ? errors.name || serverErrors.name
        : undefined,
    email:
      touched.email || email
        ? errors.email || serverErrors.email
        : undefined,
    message:
      touched.message || message
        ? errors.message || serverErrors.message
        : undefined,
  };
  const canSubmit = Object.keys(errors).length === 0 && status !== "loading";

  function touch(field: keyof typeof touched) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    setServerErrors({});
    setErrorMsg("");
    if (Object.keys(errors).length > 0) {
      setStatus("error");
      setErrorMsg("Fix the highlighted fields before sending.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, botField }),
      });
      const data = (await res.json()) as {
        error?: string;
        errors?: ContactErrors;
      };
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        setServerErrors(data.errors || {});
        return;
      }
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      setBotField("");
      setTouched({ name: false, email: false, message: false });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="contact-bot">Leave blank</label>
        <input
          id="contact-bot"
          name="bot-field"
          tabIndex={-1}
          autoComplete="off"
          value={botField}
          onChange={(e) => setBotField(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1 flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted"
        >
          Name
          <span>
            {CONTACT_LIMITS.nameMin}-{CONTACT_LIMITS.nameMax}
          </span>
        </label>
        <input
          id="contact-name"
          required
          minLength={CONTACT_LIMITS.nameMin}
          maxLength={CONTACT_LIMITS.nameMax}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => touch("name")}
          aria-invalid={Boolean(visibleErrors.name)}
          aria-describedby={visibleErrors.name ? "contact-name-hint" : undefined}
          className={`${fieldClass} ${visibleErrors.name ? "border-red" : "border-border"}`}
          placeholder="Your name"
          autoComplete="name"
        />
        {visibleErrors.name ? (
          <p id="contact-name-hint" className="mt-1 text-xs text-red">
            {visibleErrors.name}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="mb-1 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          maxLength={CONTACT_LIMITS.emailMax}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => touch("email")}
          aria-invalid={Boolean(visibleErrors.email)}
          aria-describedby={visibleErrors.email ? "contact-email-hint" : undefined}
          className={`${fieldClass} ${visibleErrors.email ? "border-red" : "border-border"}`}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {visibleErrors.email ? (
          <p id="contact-email-hint" className="mt-1 text-xs text-red">
            {visibleErrors.email}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 flex items-center justify-between font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted"
        >
          Message
          <span>
            {message.trim().length}/{CONTACT_LIMITS.messageMax}
          </span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          minLength={CONTACT_LIMITS.messageMin}
          maxLength={CONTACT_LIMITS.messageMax}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => touch("message")}
          aria-invalid={Boolean(visibleErrors.message)}
          aria-describedby={
            visibleErrors.message ? "contact-message-hint" : undefined
          }
          className={`${fieldClass} resize-y ${visibleErrors.message ? "border-red" : "border-border"}`}
          placeholder="How can I help?"
        />
        {visibleErrors.message ? (
          <p id="contact-message-hint" className="mt-1 text-xs text-red">
            {visibleErrors.message}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex w-full items-center justify-center gap-2 bg-red px-4 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-white transition hover:bg-red-dim disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Send message
          </>
        )}
      </button>
      {status === "ok" ? (
        <p className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Message sent. Thank you.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="flex items-center gap-2 text-sm text-red">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {errorMsg}
        </p>
      ) : null}
    </form>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Bot, Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setError(body.error || "Login failed.");
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="robot-grid flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="hud-frame w-full max-w-md space-y-5 bg-bg-panel p-6 md:p-8"
      >
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-red" aria-hidden />
          <div>
            <p className="section-label">Secure access</p>
            <h1 className="font-[family-name:var(--font-display)] text-xl tracking-wide">
              Admin login
            </h1>
          </div>
        </div>
        <div>
          <label
            htmlFor="admin-password"
            className="mb-1 block font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-muted"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-bg py-2.5 pl-10 pr-3 text-sm text-text outline-none focus:border-red"
              placeholder="ADMIN_PASSWORD"
              autoComplete="current-password"
            />
          </div>
        </div>
        {error ? <p className="text-sm text-red">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 bg-red px-4 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-white hover:bg-red-dim disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Enter console
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function TestToolsPage() {
  const [message, setMessage] = useState("");

  const resetQuota = async () => {
    const res = await fetch("/api/webhooks/subscription-reset", {
      method: "POST",
      headers: {
        "x-event-key": `event-${Date.now()}`,
      },
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const testIdempotency = async () => {
    const eventKey = "same-event-test";

    await fetch("/api/webhooks/subscription-reset", {
      method: "POST",
      headers: {
        "x-event-key": eventKey,
      },
    });

    const res = await fetch("/api/webhooks/subscription-reset", {
      method: "POST",
      headers: {
        "x-event-key": eventKey,
      },
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const generateLeads = async () => {
    const res = await fetch("/api/test/generate-leads", {
      method: "POST",
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <main className="app-shell">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-rose-300/15 blur-3xl" />
        <div className="absolute -right-20 -bottom-12 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl" />
      </div>

      <div className="app-grid items-center py-6 sm:py-10">
        <section className="surface-card w-full max-w-3xl p-6 sm:p-8 md:p-10">
          <span className="hero-chip">System tools</span>

          <div className="mt-5 space-y-3">
            <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
              Test and maintain the demo flows
            </h1>
            <p className="soft-copy max-w-2xl">
              Run webhook resets and concurrency tests without leaving the app.
              Every action reports its latest response below.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <button onClick={resetQuota} className="primary-button">
              Reset Provider Quota
            </button>

            <button onClick={testIdempotency} className="primary-button">
              Test Webhook Idempotency
            </button>

            <button onClick={generateLeads} className="primary-button">
              Generate 10 Concurrent Leads
            </button>
          </div>

          {message ? (
            <p className="message-chip message-neutral mt-6 text-center">
              {message}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}

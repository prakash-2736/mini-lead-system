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
    <div className="min-h-screen flex justify-center items-center p-8">
      <div className="border rounded-xl shadow p-8 space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Test Tools</h1>

        <button
          onClick={resetQuota}
          className="w-full bg-black text-white p-3 rounded"
        >
          Reset Provider Quota
        </button>

        <button
          onClick={testIdempotency}
          className="w-full bg-black text-white p-3 rounded"
        >
          Test Webhook Idempotency
        </button>

        <button
          onClick={generateLeads}
          className="w-full bg-black text-white p-3 rounded"
        >
          Generate 10 Concurrent Leads
        </button>

        {message && <p className="text-center">{message}</p>}
      </div>
    </div>
  );
}

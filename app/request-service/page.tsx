"use client";

import { useEffect, useState } from "react";

type ServiceOption = {
  _id: string;
  name: string;
};

type MessageTone = "neutral" | "success" | "error";

const emptyForm = {
  name: "",
  phone: "",
  city: "",
  description: "",
  serviceId: "",
};

export default function RequestServicePage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("neutral");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();

        setServices(data.services || []);
      } catch (error) {
        console.error(error);
        setMessage("Unable to load services right now.");
        setMessageTone("error");
      } finally {
        setIsLoadingServices(false);
      }
    };

    void loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("Submitting lead...");
    setMessageTone("neutral");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Lead submitted successfully. Allocation is now in motion.");
        setMessageTone("success");
        setForm(emptyForm);
      } else {
        setMessage(data.message || "Something went wrong.");
        setMessageTone("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to submit the lead right now.");
      setMessageTone("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-amber-300/18 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-emerald-300/14 blur-3xl" />
      </div>

      <div className="app-grid py-6 sm:py-10 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section className="surface-card p-8 sm:p-10">
          <span className="hero-chip">Customer intake</span>

          <div className="mt-5 space-y-4">
            <h1 className="hero-title">Request service with a polished form</h1>
            <p className="soft-copy max-w-xl">
              Capture lead details in one place and send them into the routing
              engine with validation, duplicate checks, and quota-aware
              matching.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Step 1",
                title: "Choose a service",
                detail: "Only available services appear in the list.",
              },
              {
                label: "Step 2",
                title: "Submit lead details",
                detail: "Name, phone, city, and a short description.",
              },
              {
                label: "Step 3",
                title: "Let routing handle it",
                detail: "The backend allocates the lead automatically.",
              },
            ].map((item) => (
              <div key={item.label} className="stat-card">
                <p className="mini-label">{item.label}</p>
                <h2 className="mt-3 text-lg font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Lead form</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Submit a new customer request
                </h2>
              </div>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {isLoadingServices
                  ? "Loading services"
                  : `${services.length} services`}
              </span>
            </div>

            <input
              className="input-field"
              placeholder="Name"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />

            <input
              className="input-field"
              placeholder="Phone"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
            />

            <input
              className="input-field"
              placeholder="City"
              value={form.city}
              onChange={(event) =>
                setForm({ ...form, city: event.target.value })
              }
            />

            <select
              className="input-field"
              value={form.serviceId}
              onChange={(event) =>
                setForm({
                  ...form,
                  serviceId: event.target.value,
                })
              }
            >
              <option value="">Select Service</option>

              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>

            <textarea
              className="input-field min-h-32 resize-none"
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description: event.target.value,
                })
              }
            />

            <button
              type="submit"
              className="primary-button w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Lead"}
            </button>

            {message ? (
              <p
                className={`message-chip mt-2 ${messageTone === "success" ? "message-success" : messageTone === "error" ? "message-error" : "message-neutral"}`}
              >
                {message}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}

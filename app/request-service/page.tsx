"use client";

import { useEffect, useState } from "react";

export default function RequestServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    description: "",
    serviceId: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data.services || []));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setMessage("Submitting...");

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Lead submitted successfully!");
      setForm({
        name: "",
        phone: "",
        city: "",
        description: "",
        serviceId: "",
      });
    } else {
      setMessage(data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg border p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-bold">Request Service</h1>

        <input
          className="w-full border p-3 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <select
          className="w-full border p-3 rounded"
          value={form.serviceId}
          onChange={(e) =>
            setForm({
              ...form,
              serviceId: e.target.value,
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
          className="w-full border p-3 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded"
        >
          Submit
        </button>

        {message && <p className="text-center">{message}</p>}
      </form>
    </div>
  );
}

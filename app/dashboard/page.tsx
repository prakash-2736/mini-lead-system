"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Provider Dashboard</h1>

      <div className="grid gap-6">
        {providers.map((provider: any) => (
          <div key={provider._id} className="border rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold">{provider.name}</h2>

            <p>Monthly Quota: {provider.monthlyQuota}</p>
            <p>Remaining Quota: {provider.quotaRemaining}</p>
            <p>Leads Received: {provider.leadsReceived}</p>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Assigned Leads</h3>

              {provider.assignedLeads.length === 0 ? (
                <p>No leads assigned</p>
              ) : (
                <ul className="space-y-2">
                  {provider.assignedLeads.map((lead: any) => (
                    <li key={lead._id} className="border p-3 rounded">
                      <p>Name: {lead.leadId?.name}</p>
                      <p>Phone: {lead.leadId?.phone}</p>
                      <p>City: {lead.leadId?.city}</p>
                      <p>Service: {lead.leadId?.serviceId?.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

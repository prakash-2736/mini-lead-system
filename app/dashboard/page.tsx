async function getDashboardData() {
  const res = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
  });

  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const providers = data.providers || [];

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

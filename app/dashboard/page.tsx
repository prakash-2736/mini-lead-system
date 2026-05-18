"use client";

import { useEffect, useState } from "react";

type LeadService = {
  name?: string;
};

type LeadDetails = {
  _id?: string;
  name?: string;
  phone?: string;
  city?: string;
  serviceId?: LeadService | null;
};

type LeadAssignment = {
  _id: string;
  leadId?: LeadDetails | null;
};

type ProviderDashboard = {
  _id: string;
  name: string;
  monthlyQuota: number;
  quotaRemaining: number;
  leadsReceived: number;
  assignedLeads: LeadAssignment[];
};

export default function DashboardPage() {
  const [providers, setProviders] = useState<ProviderDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchDashboard = async (showSkeleton = false) => {
    try {
      setError(null);

      if (showSkeleton) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const res = await fetch("/api/dashboard");
      const data = await res.json();

      if (data.success) {
        setProviders(data.providers);
        setLastUpdated(
          new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          }),
        );
      } else {
        setError(data.error || "Unable to load dashboard data.");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchDashboard(true);

    const interval = setInterval(() => {
      void fetchDashboard(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalProviders = providers.length;
  const totalLeads = providers.reduce(
    (sum, provider) => sum + provider.leadsReceived,
    0,
  );
  const totalRemaining = providers.reduce(
    (sum, provider) => sum + provider.quotaRemaining,
    0,
  );

  if (loading) {
    return (
      <main className="app-shell">
        <div className="app-grid py-6 sm:py-10">
          <section className="surface-card p-8 sm:p-10">
            <div className="animate-pulse space-y-5">
              <div className="h-5 w-32 rounded-full bg-slate-200/80" />
              <div className="h-12 w-3/4 rounded-2xl bg-slate-200/80" />
              <div className="h-5 w-full max-w-2xl rounded-2xl bg-slate-200/70" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="stat-card space-y-3">
                    <div className="h-4 w-24 rounded-full bg-slate-200/80" />
                    <div className="h-8 w-16 rounded-full bg-slate-200/80" />
                    <div className="h-4 w-full rounded-full bg-slate-200/70" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-20 -top-16 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute -left-28 top-32 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl" />
      </div>

      <div className="app-grid py-6 sm:py-10">
        <section className="surface-card overflow-hidden p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="hero-chip">Provider dashboard</span>
              <div className="space-y-3">
                <h1 className="hero-title">Live provider overview</h1>
                <p className="soft-copy max-w-3xl">
                  Monitor quota usage, assigned leads, and distribution fairness
                  with automatic refresh every three seconds.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="stat-card min-w-40">
                <p className="mini-label">Providers</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {totalProviders}
                </p>
              </div>
              <div className="stat-card min-w-40">
                <p className="mini-label">Assigned leads</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {totalLeads}
                </p>
              </div>
              <div className="stat-card min-w-40">
                <p className="mini-label">Quota remaining</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {totalRemaining}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
              Auto refresh active
            </span>
            {refreshing ? (
              <span>Refreshing live data...</span>
            ) : lastUpdated ? (
              <span>Last updated at {lastUpdated}</span>
            ) : null}
          </div>

          {error ? (
            <div className="message-chip message-error mt-6 flex items-center justify-between gap-4">
              <span>{error}</span>
              <button
                type="button"
                className="secondary-button"
                onClick={() => void fetchDashboard(true)}
              >
                Retry
              </button>
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {providers.map((provider) => {
            const quotaUsed = Math.max(
              provider.monthlyQuota - provider.quotaRemaining,
              0,
            );
            const usagePercent =
              provider.monthlyQuota > 0
                ? Math.min(
                    100,
                    Math.round((quotaUsed / provider.monthlyQuota) * 100),
                  )
                : 0;

            return (
              <article key={provider._id} className="surface-card p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-label">Provider</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      {provider.name}
                    </h2>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {usagePercent}% used
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="stat-card">
                    <p className="mini-label">Monthly quota</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {provider.monthlyQuota}
                    </p>
                  </div>
                  <div className="stat-card">
                    <p className="mini-label">Remaining</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {provider.quotaRemaining}
                    </p>
                  </div>
                  <div className="stat-card">
                    <p className="mini-label">Leads received</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">
                      {provider.leadsReceived}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                    <span>Quota usage</span>
                    <span>
                      {quotaUsed} / {provider.monthlyQuota}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Assigned leads
                  </h3>

                  {provider.assignedLeads.length === 0 ? (
                    <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                      No leads assigned yet.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {provider.assignedLeads.map((lead) => {
                        const leadDetails = lead.leadId;

                        return (
                          <div
                            key={lead._id}
                            className="rounded-2xl border border-slate-200 bg-white/90 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-base font-semibold text-slate-950">
                                {leadDetails?.name || "Unnamed lead"}
                              </p>
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                {leadDetails?.serviceId?.name || "Service"}
                              </span>
                            </div>

                            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                              <p>{leadDetails?.phone || "No phone"}</p>
                              <p>{leadDetails?.city || "No city"}</p>
                              <p className="sm:text-right">Lead linked</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";

const navigationCards = [
  {
    href: "/request-service",
    title: "Request Service",
    description:
      "Submit a lead through the modern intake flow and watch allocation happen automatically.",
    tone: "from-amber-500/15 to-orange-500/5",
  },
  {
    href: "/dashboard",
    title: "Provider Dashboard",
    description:
      "Track quotas, live assignments, and distribution fairness in one clean view.",
    tone: "from-emerald-500/15 to-teal-500/5",
  },
  {
    href: "/test-tools",
    title: "Test Tools",
    description:
      "Trigger webhook resets and concurrency checks with a single click.",
    tone: "from-rose-500/15 to-orange-500/5",
  },
] as const;

const featurePills = [
  "Fair round-robin lead allocation",
  "Mandatory provider assignment rules",
  "Monthly quota enforcement",
  "Duplicate lead prevention",
  "Webhook idempotency",
  "Real-time dashboard updates",
  "Concurrency-safe allocation",
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -right-16 top-24 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="app-grid py-6 sm:py-10">
        <section className="surface-card relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <span className="hero-chip">Lead Ops Demo</span>

              <div className="space-y-4">
                <h1 className="hero-title max-w-3xl">
                  Mini Lead{" "}
                  <span className="hero-accent">Distribution System</span>
                </h1>
                <p className="soft-copy max-w-2xl">
                  A polished full-stack demo for fair routing, provider quotas,
                  webhook safety, and live allocation visibility.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {featurePills.slice(0, 4).map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-slate-200 bg-white/75 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {navigationCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`group surface-card block border-slate-200 bg-linear-to-br ${card.tone} p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-2xl`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mini-label">Open</p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950">
                        {card.title}
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 transition group-hover:text-slate-950">
                      View
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Live routing",
              value: "Round robin",
              detail: "Balanced allocation with quota-aware fallbacks.",
            },
            {
              label: "Dashboard refresh",
              value: "Every 3 seconds",
              detail: "Provider status updates without manual reloads.",
            },
            {
              label: "Safety checks",
              value: "Built in",
              detail: "Duplicate prevention and webhook idempotency included.",
            },
          ].map((item) => (
            <div key={item.label} className="stat-card">
              <p className="mini-label">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        <section className="surface-card p-6 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Included capabilities</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Everything the demo exercises
              </h2>
            </div>
            <p className="helper-copy max-w-2xl sm:text-right">
              A clean layout with warm saffron and emerald accents keeps the UI
              modern without feeling generic.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {pill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

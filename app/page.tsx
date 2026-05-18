import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-center mb-4 text-taupe-950">
          Mini Lead Distribution System
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Full Stack Developer Assignment Demo
        </p>

        <div className="grid gap-4">
          <Link
            href="/request-service"
            className="block text-center bg-black text-white py-4 rounded-xl hover:opacity-90"
          >
            Customer Service Request Form
          </Link>

          <Link
            href="/dashboard"
            className="block text-center bg-black text-white py-4 rounded-xl hover:opacity-90"
          >
            Provider Dashboard
          </Link>

          <Link
            href="/test-tools"
            className="block text-center bg-black text-white py-4 rounded-xl hover:opacity-90"
          >
            Test Tools
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500 space-y-2">
          <p>✔ Fair round-robin lead allocation</p>
          <p>✔ Mandatory provider assignment rules</p>
          <p>✔ Monthly quota enforcement</p>
          <p>✔ Duplicate lead prevention</p>
          <p>✔ Webhook idempotency</p>
          <p>✔ Real-time dashboard updates</p>
          <p>✔ Concurrency-safe allocation</p>
        </div>
      </div>
    </div>
  );
}

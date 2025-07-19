// components/ApplicationsList.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface Application {
  _id: string;
  jobId: { _id: string; title: string; companyName: string; };
  status: "applied" | "accepted" | "rejected";
  appliedAt: string;
}

export default function ApplicationsList() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get("status") || "applied";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        if (data.success) setApps(data.applications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = apps.filter(a => a.status === statusFilter);

  const statusMap = [
    { key: "applied", label: "In Progress", icon: Clock },
    { key: "accepted", label: "Accepted", icon: CheckCircle },
    { key: "rejected", label: "Rejected", icon: XCircle },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar Filters */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase">My Applications</h2>
        {statusMap.map(({ key, label, icon: Icon }) => (
          <Link
            key={key}
            href={`/applications?status=${key}`}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              statusFilter === key
                ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </aside>

      {/* Applications List */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {statusMap.find(s => s.key === statusFilter)?.label} Applications
        </h1>

        {filtered.length === 0 ? (
          <p className="text-gray-600">No applications found in this category.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => (
              <div key={app._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <Link href={`/jobs/${app.jobId._id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                  {app.jobId.title}
                </Link>
                <p className="text-sm text-gray-500">{app.jobId.companyName}</p>
                <p className="text-sm text-gray-500">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// src/components/StudentDashboard.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { Plus, Briefcase, User, TrendingUp } from "lucide-react";

interface Application {
  _id: string;
  status: "applied" | "shortlisted" | "rejected";
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ success: boolean; applications: Application[] }>("/api/applications");
      if (data.success) {
        setApps(data.applications);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const total = apps.length;
  const inProgress = apps.filter(a => a.status === "applied").length;
  const shortlisted = apps.filter(a => a.status === "shortlisted").length;
  const rejected = apps.filter(a => a.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your job search today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/jobs"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Browse Jobs</h3>
              <p className="text-sm text-gray-600">Find your next opportunity</p>
            </div>
          </div>
        </Link>

        <Link
          href="/student/profile"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-lg p-3">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Keep your profile current</p>
            </div>
          </div>
        </Link>

        <Link
          href="/applications"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Applications</h3>
              <p className="text-sm text-gray-600">Track your progress</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Statistics</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{shortlisted}</div>
              <div className="text-sm text-gray-600">Shortlisted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/AdminDashboard.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { Plus, Building2, Users, Briefcase, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    students: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [ jobsRes, companiesRes, studentsRes, appsRes ] = await Promise.all([
          axios.get<{ success: boolean; jobs: Array<{ lastDateToApply: string }> }>("/api/jobs"),
          axios.get<{ success: boolean; companies: any[] }>("/api/companies"),
          axios.get<{ success: boolean; count: number }>("/api/admin/students"),
          axios.get<{ success: boolean; count: number }>("/api/admin/applications"),
        ]);

        const today = new Date();

        // Only count jobs whose lastDateToApply is today or in the future
        const activeJobsCount = jobsRes.data.success
          ? jobsRes.data.jobs.filter(job => {
              const deadline = new Date(job.lastDateToApply);
              return deadline >= today;
            }).length
          : 0;

        setStats({
          jobs: activeJobsCount,
          companies: companiesRes.data.success ? companiesRes.data.companies.length : 0,
          students: studentsRes.data.success ? studentsRes.data.count : 0,
          applications: appsRes.data.success ? appsRes.data.count : 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage jobs, companies, and track campus recruitment activities.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          href="/jobs/new"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Post New Job</h3>
              <p className="text-sm text-gray-600">Create job opening</p>
            </div>
          </div>
        </Link>

        <Link
          href="/companies"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-lg p-3">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Companies</h3>
              <p className="text-sm text-gray-600">Edit company details</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/students"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-lg p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Students</h3>
              <p className="text-sm text-gray-600">Student database</p>
            </div>
          </div>
        </Link>

        <Link
          href="/jobs"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 rounded-lg p-3">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Jobs</h3>
              <p className="text-sm text-gray-600">Edit/Delete jobs</p>
            </div>
          </div>
        </Link>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 border-be">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        {loading ? (
          <p className="text-gray-600">Loading statistics…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.jobs}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.companies}</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.students}</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.applications}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

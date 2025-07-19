"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Calendar, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

interface Applicant {
  _id: string;
  studentId: { _id: string; userId: { _id: string; name: string } };
  status: string;
  appliedAt: string;
}

export default function JobApplicants({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("applied");

  useEffect(() => {
    fetchApplicants();
  }, []);

  async function fetchApplicants() {
    setLoading(true);
    try {
      const { data } = await axios.get<{ success: boolean; applicants: Applicant[] }>(
        `/api/jobs/${jobId}/applicants`
      );
      if (data.success) setApplicants(data.applicants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function submitDecisions() {
    if (selected.length === 0) {
      setError("Select at least one applicant to accept.");
      return;
    }
    setError("");
    try {
      await axios.post("/api/applications/batch-update", { acceptedIds: selected, jobId });
      await fetchApplicants();
      setSelected([]);
    } catch (err) {
      console.error(err);
      setError("Failed to submit decisions.");
    }
  }

  async function updateApplicationStatus(applicationId: string, studentUserId: string, status: string) {
    try {
      await axios.put(`/api/applications/${applicationId}`, { status });
      
      // Update student's isPlaced status if accepted
      if (status === "accepted") {
        await axios.put(`/api/student/profile`, { 
          userId: studentUserId, 
          isPlaced: true 
        });
      }
      
      await fetchApplicants();
    } catch (err) {
      console.error(err);
      setError("Failed to update application status.");
    }
  }

  const filteredApplicants = applicants.filter(app => 
    statusFilter === "all" || app.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push(`/jobs/${jobId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" /> Back to Job
        </button>
        
        {statusFilter === "applied" && (
          <button
            onClick={submitDecisions}
            disabled={selected.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Decisions ({selected.length} selected)
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Applications</option>
          <option value="applied">Applied ({applicants.filter(a => a.status === "applied").length})</option>
          <option value="accepted">Accepted ({applicants.filter(a => a.status === "accepted").length})</option>
          <option value="rejected">Rejected ({applicants.filter(a => a.status === "rejected").length})</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Applicants List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredApplicants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-600">
              {applicants.length === 0 
                ? "No one has applied for this job yet." 
                : `No applicants with status "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplicants.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Checkbox only for "applied" status */}
                  {statusFilter === "applied" && app.status === "applied" && (
                    <input
                      type="checkbox"
                      checked={selected.includes(app._id)}
                      onChange={() => toggleSelect(app._id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {app.studentId.userId.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.studentId.userId.name}</p>
                      <p className="text-sm text-gray-500">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="ml-1">{app.status}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Individual Action Buttons */}
                  {app.status === "applied" && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateApplicationStatus(app._id, app.studentId.userId._id, "accepted")}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(app._id, app.studentId.userId._id, "rejected")}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  
                  <Link
                    href={`/student/${app.studentId._id}`}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                    title="View Student Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

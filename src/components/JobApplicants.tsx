// components/JobApplicants.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Download,
  Eye
} from "lucide-react";

interface Applicant {
  _id: string;
  jobId: string;
  studentId: {
    _id: string;
    userId: {
      _id: string;
      name: string;
    };
  };
  status: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface Job {
  _id: string;
  title: string;
  companyName: string;
}

interface JobApplicantsProps {
  jobId: string;
}

export default function JobApplicants({ jobId }: JobApplicantsProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchApplicants();
    fetchJob();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${jobId}/applicants`);
      const data = await response.json();

      if (data.success) {
        setApplicants(data.applicants);
      } else {
        setError(data.message || "Failed to fetch applicants");
      }
    } catch (error) {
      setError("Error fetching applicants");
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = await response.json();

      if (data.success) {
        setJob(data.job);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        setApplicants(prev => 
          prev.map(app => 
            app._id === applicationId ? { ...app, status } : app
          )
        );
      } else {
        setError(data.message || "Failed to update status");
      }
    } catch (error) {
      setError("Error updating application status");
      console.error("Error updating application status:", error);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    if (statusFilter === "") return true;
    return applicant.status === statusFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href={`/jobs/${jobId}`}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Applicants</h1>
            {job && (
              <p className="text-gray-600">
                {job.title} at {job.companyName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{filteredApplicants.length} applicants</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Applicants List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredApplicants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-600">
              {applicants.length === 0 
                ? "No one has applied for this job yet." 
                : "No applicants match the selected filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {applicant.studentId.userId.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.studentId.userId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Student ID: {applicant.studentId._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(applicant.appliedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(applicant.status)}`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/student/${applicant.studentId._id}`}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Link>
                      
                      {applicant.status === "applied" && (
                        <div className="inline-flex space-x-2">
                          <button
                            onClick={() => updateApplicationStatus(applicant._id, "shortlisted")}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(applicant._id, "rejected")}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {applicant.status === "shortlisted" && (
                        <div className="inline-flex space-x-2">
                          <button
                            onClick={() => updateApplicationStatus(applicant._id, "accepted")}
                            className="text-green-600 hover:text-green-900"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(applicant._id, "rejected")}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

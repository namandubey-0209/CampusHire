// components/JobDetail.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  GraduationCap,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import axios from "axios";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  companyId: string;
  description: string;
  location: string;
  mode: string;
  minCGPA: number;
  eligibleBranches: string[];
  lastDateToApply: string;
  postedBy: { _id: string; name: string };
  createdAt: string;
}

interface JobDetailProps {
  jobId: string;
}

export default function JobDetail({ jobId }: JobDetailProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const isAdmin = session?.user?.role === "admin";
  const isStudent = session?.user?.role === "student";

  useEffect(() => {
    fetchJob();
    if (isStudent) {
      checkApplicationStatus();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/jobs/${jobId}`);
      if (data.success) {
        setJob(data.job);
      } else {
        setError(data.message || "Failed to fetch job");
      }
    } catch (err) {
      setError("Error fetching job");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const { data } = await axios.get("/api/applications");
      if (data.success) {
        const applied = data.applications.some(
          (app: any) => app.jobId._id === jobId
        );
        setHasApplied(applied);
      }
    } catch (err) {
      console.error("Error checking application status:", err);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const isExpired = (dateString: string) =>
    new Date(dateString) < new Date();

  const handleApply = async () => {
    if (!isStudent || !job) return;
    if (isExpired(job.lastDateToApply)) {
      setError("Cannot apply: the application deadline has passed.");
      return;
    }

    setApplying(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(`/api/jobs/${jobId}/apply`);
      if (data.success) {
        setSuccess("Application submitted successfully!");
        setHasApplied(true);
        window.dispatchEvent(new CustomEvent("notification-update"));
      } else {
        setError(data.message || "Failed to apply");
      }
    } catch (err) {
      setError("Error applying to job");
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const { data } = await axios.delete(`/api/jobs/${jobId}`);
      if (data.success) {
        router.push("/jobs");
      } else {
        setError(data.message || "Failed to delete job");
      }
    } catch (err) {
      setError("Error deleting job");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Job not found
        </h3>
        <p className="text-gray-600 mb-4">
          The job you're looking for doesn't exist.
        </p>
        <Link
          href="/jobs"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  const expired = isExpired(job.lastDateToApply);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/jobs"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <Link
              href={`/companies/${job.companyId}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {job.companyName}
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Link
              href={`/jobs/${job._id}/applicants`}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>View Applicants</span>
            </Link>
            <Link
              href={`/jobs/${job._id}/edit`}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit className="h-5 w-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Job Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {job.title}
                </h2>
                {expired && (
                  <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                    Expired
                  </span>
                )}
              </div>
              <p className="text-gray-600">Posted by {job.postedBy.name}</p>
            </div>

            {isStudent && (
              <div>
                {hasApplied ? (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <span>Already Applied</span>
                  </div>
                ) : expired ? (
                  <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                    Application Closed
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Work Mode</p>
                <p className="font-medium capitalize">{job.mode}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <GraduationCap className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Min CGPA</p>
                <p className="font-medium">{job.minCGPA}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-medium">{formatDate(job.lastDateToApply)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Job Description
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        </div>

        {/* Eligibility */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Eligibility
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-2">Eligible Branches</p>
              <div className="flex flex-wrap gap-2">
                {job.eligibleBranches.map((branch) => (
                  <span
                    key={branch}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {branch}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Minimum CGPA Required
              </p>
              <p className="text-lg font-medium text-gray-900">{job.minCGPA}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/JobsList.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  Users, 
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle
} from "lucide-react";

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
  postedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function JobsList() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applying, setApplying] = useState<string | null>(null);

  const isAdmin = session?.user?.role === "admin";
  const isStudent = session?.user?.role === "student";

  useEffect(() => {
    fetchJobs();
    if (isStudent) {
      fetchUserApplications();
    }
  }, [isStudent]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/jobs");

      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError(data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      setError("Error fetching jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const { data } = await axios.get("/api/applications");
      if (data.success) {
        const jobIds = data.applications.map((app: any) => app.jobId._id || app.jobId);
        setAppliedJobs(jobIds);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const { data } = await axios.delete(`/api/jobs/${jobId}`);
      if (data.success) {
        setJobs(jobs.filter(job => job._id !== jobId));
      } else {
        setError(data.message || "Failed to delete job");
      }
    } catch (error) {
      setError("Error deleting job");
      console.error("Error deleting job:", error);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!isStudent) return;

    setApplying(jobId);
    setError("");

    try {
      const { data } = await axios.post(`/api/jobs/${jobId}/apply`);

      if (data.success) {
        setAppliedJobs(prev => [...prev, jobId]);
        // Optionally show success message
      } else {
        setError(data.message || "Failed to apply");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Error applying to job");
      console.error("Error applying to job:", error);
    } finally {
      setApplying(null);
    }
  };

  const canApply = (job: Job) => {
    if (!isStudent) return false;
    if (appliedJobs.includes(job._id)) return false;
    if (isExpired(job.lastDateToApply)) return false;
    return true;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "" || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesMode = modeFilter === "" || job.mode === modeFilter;
    const matchesBranch = branchFilter === "" || job.eligibleBranches.includes(branchFilter);

    return matchesSearch && matchesLocation && matchesMode && matchesBranch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Manage Jobs" : "Browse Jobs"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? "Create, edit, and manage job postings" : "Find your next opportunity"}
          </p>
        </div>
        
        {isAdmin && (
          <Link
            href="/jobs/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Job</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Modes</option>
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
          
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Branches</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {jobs.length === 0 ? "No jobs posted yet." : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${
                isExpired(job.lastDateToApply) ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    {isExpired(job.lastDateToApply) && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Expired
                      </span>
                    )}
                    {appliedJobs.includes(job._id) && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Applied
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="text-blue-600 hover:text-blue-700 font-medium mb-3 inline-block"
                  >
                    {job.companyName}
                  </Link>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">{job.mode}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Apply by {formatDate(job.lastDateToApply)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      Min CGPA: <span className="font-medium">{job.minCGPA}</span>
                    </span>
                    <span className="text-gray-500">
                      Eligible: <span className="font-medium">{job.eligibleBranches.join(", ")}</span>
                    </span>
                  </div>

                  {/* Apply Button for Students */}
                  {isStudent && (
                    <div className="mt-4">
                      {appliedJobs.includes(job._id) ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Already Applied</span>
                        </div>
                      ) : isExpired(job.lastDateToApply) ? (
                        <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
                          Application Closed
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          disabled={applying === job._id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {applying === job._id ? "Applying..." : "Apply Now"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {isAdmin && (
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/jobs/${job._id}/applicants`}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View Applicants"
                    >
                      <Users className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/jobs/${job._id}/edit`}
                      className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Edit Job"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

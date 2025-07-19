"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Save, Building2, Plus } from "lucide-react";
import Link from "next/link";

interface Company {
  _id: string;
  name: string;
}

export default function CreateJobForm() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"company" | "job">("company");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCreateCompany, setShowCreateCompany] = useState(false);

  // Job form data
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    mode: "",
    minCGPA: "",
    eligibleBranches: [] as string[],
    lastDateToApply: "",
  });

  // Company form data
  const [companyForm, setCompanyForm] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logoUrl: "",
  });

  const branches = [
    "Computer Science",
    "Electronics",
    "Mechanical", 
    "Civil",
    "Electrical",
    "Information Technology",
    "Biotechnology",
    "Chemical",
  ];

  const modes = [
    { value: "onsite", label: "Onsite" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get("/api/companies");
      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleJobInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBranchChange = (branch: string) => {
    setJobForm(prev => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter(b => b !== branch)
        : [...prev.eligibleBranches, branch]
    }));
  };

  const createNewCompany = async () => {
    if (!companyForm.name || !companyForm.description) {
      setError("Company name and description are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/api/companies", companyForm);
      
      if (data.success) {
        const newCompany = { _id: data.company._id, name: data.company.name };
        setSelectedCompany(newCompany);
        setCompanies(prev => [...prev, newCompany]);
        setShowCreateCompany(false);
        setStep("job");
        setError("");
      } else {
        setError(data.message || "Failed to create company");
      }
    } catch (error) {
      setError("Error creating company");
      console.error("Error creating company:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectExistingCompany = (company: Company) => {
    setSelectedCompany(company);
    setStep("job");
  };

  const submitJob = async () => {
    if (!selectedCompany) {
      setError("Please select or create a company first");
      return;
    }

    if (!jobForm.title || !jobForm.description || !jobForm.location || !jobForm.mode || 
        !jobForm.minCGPA || jobForm.eligibleBranches.length === 0 || !jobForm.lastDateToApply) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/api/jobs", {
        ...jobForm,
        companyId: selectedCompany._id,
        companyName: selectedCompany.name,
        minCGPA: parseFloat(jobForm.minCGPA),
      });

      if (data.success) {
        router.push("/jobs");
      } else {
        setError(data.message || "Failed to create job");
      }
    } catch (error) {
      setError("Error creating job");
      console.error("Error creating job:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
            <p className="text-gray-600">
              {step === "company" ? "First, select or create a company" : `Creating job for ${selectedCompany?.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Step 1: Company Selection/Creation */}
      {step === "company" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Company</h2>
            
            {!showCreateCompany ? (
              <div className="space-y-4">
                {/* Existing Companies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companies.map(company => (
                    <div
                      key={company._id}
                      onClick={() => selectExistingCompany(company)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-8 w-8 text-gray-400" />
                        <span className="font-medium text-gray-900">{company.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Company Button */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateCompany(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add New Company</span>
                  </button>
                </div>
              </div>
            ) : (
              /* New Company Form */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Create New Company</h3>
                  <button
                    onClick={() => setShowCreateCompany(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={companyForm.name}
                      onChange={handleCompanyInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={companyForm.website}
                      onChange={handleCompanyInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={companyForm.location}
                      onChange={handleCompanyInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="logoUrl"
                      value={companyForm.logoUrl}
                      onChange={handleCompanyInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://company.com/logo.png"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={companyForm.description}
                    onChange={handleCompanyInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the company..."
                  />
                </div>

                <button
                  onClick={createNewCompany}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Creating Company..." : "Create Company & Continue"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Job Creation Form */}
      {step === "job" && selectedCompany && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
            <p className="text-gray-600">Company: {selectedCompany.name}</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={jobForm.title}
                  onChange={handleJobInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Software Engineer Intern"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={jobForm.location}
                  onChange={handleJobInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bangalore, India"
                />
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Mode *
                </label>
                <select
                  name="mode"
                  value={jobForm.mode}
                  onChange={handleJobInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select work mode</option>
                  {modes.map(mode => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min CGPA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum CGPA *
                </label>
                <input
                  type="number"
                  name="minCGPA"
                  value={jobForm.minCGPA}
                  onChange={handleJobInputChange}
                  step="0.1"
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 7.5"
                />
              </div>

              {/* Application Deadline */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  name="lastDateToApply"
                  value={jobForm.lastDateToApply}
                  onChange={handleJobInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={jobForm.description}
                onChange={handleJobInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the job responsibilities, requirements, and benefits..."
              />
            </div>

            {/* Eligible Branches */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eligible Branches *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {branches.map(branch => (
                  <label key={branch} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobForm.eligibleBranches.includes(branch)}
                      onChange={() => handleBranchChange(branch)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep("company")}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Company
              </button>
              <button
                onClick={submitJob}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? "Creating..." : "Create Job"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Building2, Globe, MapPin, Edit, Save } from "lucide-react";

interface Job {
  _id: string;
  title: string;
}

interface Company {
  _id: string;
  name: string;
  description: string;
  website?: string;
  location?: string;
  logoUrl?: string;
}

export default function CompanyDetail({ companyId }: { companyId: string }) {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "admin";
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Company>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteCompany = async () => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    setDeleting(true);
    setError("");
    try {
      console.log("Deleting company with ID:", companyId);
      const { data } = await axios.delete<{
        success: boolean;
        message?: string;
      }>(`/api/company/${companyId}`);
      if (data.success) {
        router.push("/admin/companies");
      } else {
        setError(data.message || "Failed to delete company");
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      setError("Error deleting company");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [cRes, jRes] = await Promise.all([
          axios.get<{ success: boolean; companyProfile: Company }>(
            `/api/company/${companyId}`
          ),
          axios.get<{ success: boolean; jobs: Job[] }>(
            `/api/company/${companyId}/jobs`
          ),
        ]);

        if (cRes.data.success) {
          setCompany(cRes.data.companyProfile);
          setForm(cRes.data.companyProfile);
        }
        if (jRes.data.success) {
          setJobs(jRes.data.jobs);
        }
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Failed to load company details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await axios.patch<{
        success: boolean;
        company: Company;
        message?: string;
      }>(`/api/company/${companyId}`, form);
      if (data.success) {
        setCompany(data.company);
        setEditMode(false);
      } else {
        setError(data.message || "Failed to save");
      }
    } catch (err) {
      console.error("Error saving company details:", err);
      setError("Error saving details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Company not found</h3>
      </div>
    );
  }

  const renderWebsite = () => {
    if (!company.website) return <p className="text-gray-500 italic">—</p>;
    try {
      const hostname = new URL(company.website).hostname;
      return (
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {hostname}
        </a>
      );
    } catch {
      // Fallback if URL is invalid
      return (
        <a
          href={
            company.website.startsWith("http")
              ? company.website
              : `https://${company.website}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {company.website}
        </a>
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Company Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {editMode ? (
              <div className="h-20 w-20 border border-gray-300 rounded-lg flex items-center justify-center">
                Logo upload not implemented
              </div>
            ) : company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-20 w-20 object-contain rounded-lg"
                onError={(e) => {
                  // Hide the img element and show the Building2 icon instead
                  e.currentTarget.style.display = "none";
                  const fallbackDiv = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  if (fallbackDiv) fallbackDiv.style.display = "flex";
                }}
              />
            ) : null}
            {!editMode && (
              <Building2
                className="h-20 w-20 text-gray-400"
                style={{ display: company.logoUrl ? "none" : "flex" }}
              />
            )}
            <div>
              {editMode ? (
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="text-3xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">
                  {company.name}
                </h1>
              )}
              {editMode ? (
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  rows={3}
                  className="mt-4 w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700 mt-4 whitespace-pre-wrap">
                  {company.description}
                </p>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center space-x-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{saving ? "Saving..." : "Save"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDeleteCompany}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {deleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span>{deleting ? "Deleting..." : "Delete"}</span>
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </label>
            {editMode ? (
              <input
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
              />
            ) : company.location ? (
              <p className="text-gray-900">{company.location}</p>
            ) : (
              <p className="text-gray-500 italic">—</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
              <Globe className="h-4 w-4" />
              <span>Website</span>
            </label>
            {editMode ? (
              <input
                name="website"
                value={form.website || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
              />
            ) : (
              renderWebsite()
            )}
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Company's Jobs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Open Roles</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No active job postings.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => router.push(`/jobs/${job._id}`)}
                className="cursor-pointer bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                  {job.title}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

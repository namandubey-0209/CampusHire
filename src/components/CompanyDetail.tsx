// components/CompanyDetail.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [cRes, jRes] = await Promise.all([
        fetch(`/api/company/${companyId}`),
        fetch(`/api/jobs?companyId=${companyId}`)
      ]);
      const cData = await cRes.json();
      const jData = await jRes.json();
      if (cData.success) {
        setCompany(cData.company);
        setForm(cData.company);
      }
      if (jData.success) setJobs(jData.jobs);
      setLoading(false);
    })();
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/company/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setCompany(data.company);
        setEditMode(false);
      } else {
        setError(data.message || "Failed to save");
      }
    } catch {
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
              <img src={company.logoUrl} alt={company.name} className="h-20 w-20 object-contain rounded-lg" />
            ) : (
              <Building2 className="h-20 w-20 text-gray-400" />
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
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
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
                <p className="text-gray-700 mt-4 whitespace-pre-wrap">{company.description}</p>
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
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["location", "website"].map(field => (
            <div key={field}>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                {field === "location" ? <MapPin className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                <span className="capitalize">{field}</span>
              </label>
              {editMode ? (
                <input
                  name={field}
                  value={(form as any)[field] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
                />
              ) : company[field as keyof Company] ? (
                field === "website" ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {new URL(company.website!).hostname}
                  </a>
                ) : (
                  <p className="text-gray-900">{company.location}</p>
                )
              ) : (
                <p className="text-gray-500 italic">—</p>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Company’s Jobs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Open Roles</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No active job postings.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
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

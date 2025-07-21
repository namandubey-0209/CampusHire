// src/app/jobs/[jobId]/edit/page.tsx
"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ArrowLeft, Save } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  mode: string;
  minCGPA: number;
  eligibleBranches: string[];
  lastDateToApply: string;
}

const branches = [
  "Computer Science", "Electronics", "Mechanical", "Civil",
  "Electrical", "Information Technology", "Biotechnology", "Chemical"
];
const modes = ["onsite", "remote", "hybrid"];

export default function EditJobPage() {
  const router = useRouter();
  const { jobId } = useParams() as { jobId: string };
  const [form, setForm] = useState<Partial<Job>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get<{ success: boolean; job: Job }>(`/api/jobs/${jobId}`)
      .then(res => {
        if (res.data.success) {
          const j = res.data.job;
          setForm({
            title: j.title,
            companyName: j.companyName,
            location: j.location,
            description: j.description,
            mode: j.mode,
            minCGPA: j.minCGPA,
            eligibleBranches: j.eligibleBranches,
            lastDateToApply: j.lastDateToApply.slice(0, 10)
          });
        }
      })
      .catch(() => setError("Failed to load job"))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "eligibleBranches") {
      const list = form.eligibleBranches || [];
      setForm(prev => ({
        ...prev,
        eligibleBranches: list.includes(value)
          ? list.filter(b => b !== value)
          : [...list, value]
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const payload = {
        title: form.title,
        companyName: form.companyName,
        location: form.location,
        description: form.description,
        mode: form.mode,
        minCGPA: Number(form.minCGPA),
        eligibleBranches: form.eligibleBranches,
        lastDateToApply: form.lastDateToApply
      };
      const res = await axios.patch(`/api/jobs/${jobId}`, payload);
      if (res.data.success) router.push(`/jobs/${jobId}`);
      else setError(res.data.message || "Update failed");
    } catch (err) {
      const ae = err as AxiosError<{ message?: string }>;
      setError(ae.response?.data?.message || "Error updating");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-8 w-8 border-t-2 border-blue-600 rounded-full"></div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="mr-2" /> Back
      </button>

      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Edit Job</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="space-y-6">
        {[
          { label: "Job Title", name: "title" },
          { label: "Company Name", name: "companyName" },
          { label: "Location", name: "location" },
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
            <input
              name={field.name}
              value={(form as any)[field.name] || ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Work Mode</label>
          <select
            name="mode"
            value={form.mode || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Select mode</option>
            {modes.map(m => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum CGPA</label>
            <input
              name="minCGPA" type="number" step="0.1"
              value={form.minCGPA || ""} onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
            <input
              name="lastDateToApply" type="date"
              value={form.lastDateToApply || ""} onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Eligible Branches</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
            {branches.map(b => (
              <label key={b} className="inline-flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  name="eligibleBranches"
                  value={b}
                  checked={form.eligibleBranches?.includes(b)}
                  onChange={handleChange}
                  className="accent-green-600 h-4 w-4 rounded focus:ring-green-500"
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>


        <textarea
          name="description"
          name="description"
          rows={5}
          value={form.description || ""}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />


        <div>
          
          <textarea
            name="description" rows={5}
            value={form.description || ""} onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 w-full inline-flex justify-center py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {saving
          ? <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
          : <Save className="h-5 w-5 mr-2" />}
        {saving ? "Saving..." : "Update Job"}
      </button>
    </div>
  );
}

// components/StudentProfile.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Edit, Save, User, Mail, GraduationCap, Calendar, Star } from "lucide-react";

interface Profile {
  name: string;
  email: string;
  enrollment: string;
  branch: string;
  year: number;
  cgpa: number;
  resumeUrl: string;
  skills: string[];
}

interface Props {
  userId: string;
  editable: boolean;
}

export default function StudentProfile({ userId, editable }: Props) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [error, setError] = useState("");

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

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/student/${userId}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
          setForm(data.profile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setForm({
        ...form,
        skills: value
          .split(",")
          .map(s => s.trim())
          .filter(s => s.length > 0),
      });
    } else if (name === "year" || name === "cgpa") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/student/${userId}`, {
        method: profile ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setEditMode(false);
      } else {
        setError(data.message || "Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      setError("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm(profile || {});
    setEditMode(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile && !editMode) {
    return (
      <div className="py-12 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">No Profile Found</h2>
        <p className="mt-2 text-gray-600">You haven't created your profile yet.</p>
        {editable && (
          <button
            onClick={() => setEditMode(true)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Create Profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600">
            {editable
              ? editMode
                ? "Fill in your details"
                : "View or edit your profile"
              : `Viewing ${profile?.name}'s profile`}
          </p>
        </div>
        {editable && (
          <div className="flex items-center space-x-2">
            {editMode && (
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : editMode ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
              <span>{saving ? "Saving..." : editMode ? "Save" : profile ? "Edit" : "Create"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Profile Form / Display */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <User className="h-4 w-4" /><span>Full Name</span>
          </label>
          {editMode ? (
            <input
              name="name"
              type="text"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile?.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <Mail className="h-4 w-4" /><span>Email</span>
          </label>
          {editMode ? (
            <input
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile?.email}</p>
          )}
        </div>

        {/* Enrollment */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <GraduationCap className="h-4 w-4" /><span>Enrollment No.</span>
          </label>
          {editMode ? (
            <input
              name="enrollment"
              type="text"
              value={form.enrollment || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            />
          ) : ( 
            <p className="text-gray-900 font-mono">{profile?.enrollment}</p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">Branch</label>
          {editMode ? (
            <select
              name="branch"
              value={form.branch || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            >
              <option value="">Select Branch</option>
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          ) : (
            <p className="text-gray-900">{profile?.branch}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <Calendar className="h-4 w-4" /><span>Year</span>
          </label>
          {editMode ? (
            <select
              name="year"
              value={form.year || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              {[1,2,3,4].map(y => (
                <option key={y} value={y}>{y} Year</option>
              ))}
            </select>
          ) : (
            <p className="text-gray-900">{profile?.year} Year</p>
          )}
        </div>

        {/* CGPA */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <Star className="h-4 w-4" /><span>CGPA</span>
          </label>
          {editMode ? (
            <input
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.cgpa || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile?.cgpa}/10</p>
          )}
        </div>

        {/* Resume URL */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1">Resume URL</label>
          {editMode ? (
            <input
              name="resumeUrl"
              type="url"
              value={form.resumeUrl || ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            />
          ) : profile?.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>
          ) : (
            <p className="text-gray-500 italic">No resume uploaded</p>
          )}
        </div>

        {/* Skills */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1">Skills</label>
          {editMode ? (
            <textarea
              name="skills"
              rows={2}
              value={Array.isArray(form.skills) ? form.skills.join(", ") : ""}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500"
            />
          ) : profile?.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No skills added</p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Star,
  UploadCloud,
  Edit,
  Save,
  Trash2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  email: string;
  enrollmentNo: string;
  branch: string;
  year: number;
  cgpa: number;
  resumeUrl?: string;
  skills: string[];
  isPlaced?: boolean;
}

interface Props {
  userId: string; // This is now actually studentId from the params
  editable: boolean;
}

export default function StudentProfile({ userId: studentId, editable }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    fetchProfile();
  }, [studentId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{
        success: boolean;
        student: any;
      }>(`/api/admin/students/${studentId}`);

      if (data.success && data.student) {
        const mappedProfile: Profile = {
          name: data.student.name || "",
          email: data.student.email || "",
          enrollmentNo: data.student.enrollmentNo,
          branch: data.student.branch,
          year: data.student.year,
          cgpa: data.student.cgpa,
          resumeUrl: data.student.resumeUrl,
          skills: data.student.skills || [],
          isPlaced: data.student.isPlaced || false,
        };

        setProfile(mappedProfile);
        setForm(mappedProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const { data } = await axios.delete(`/api/admin/students/${studentId}`);
      if (data.success) {
        router.push("/admin/students");
      } else {
        setError(data.message || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Error deleting student");
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setForm({
        ...form,
        skills: value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      });
    } else if (name === "year" || name === "cgpa") {
      setForm({ ...form, [name]: Number(value) });
    } else if (name === "enrollmentNo") {
      setForm({ ...form, enrollmentNo: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axios.post<{
        success: boolean;
        resumeUrl: string;
        message?: string;
      }>(`/api/student/${studentId}/uploadResume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        return data.resumeUrl;
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        "Upload error: " + (axiosError.message || "Unknown error")
      );
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      let resumeUrl = form.resumeUrl;

      if (selectedFile) {
        resumeUrl = (await uploadResume()) as string;
      }

      const { data } = await axios({
        method: profile ? "PATCH" : "POST",
        url: "/api/student/profile",
        data: {
          enrollmentNo: form.enrollmentNo,
          branch: form.branch,
          year: form.year,
          cgpa: form.cgpa,
          resumeUrl,
          skills: form.skills,
          name: form.name,
          email: form.email,
          isPlaced: form.isPlaced || false,
        },
      });

      if (data.success && data.profile) {
        const mappedProfile: Profile = {
          name: data.profile.name || form.name || "",
          email: data.profile.email || form.email || "",
          enrollmentNo: data.profile.enrollmentNo,
          branch: data.profile.branch,
          year: data.profile.year,
          cgpa: data.profile.cgpa,
          resumeUrl: data.profile.resumeUrl,
          skills: data.profile.skills || [],
          isPlaced: data.profile.isPlaced || false,
        };

        setProfile(mappedProfile);
        setEditMode(false);
        setSelectedFile(null);
      } else {
        setError("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm(profile || {});
    setEditMode(false);
    setSelectedFile(null);
    setError("");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

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
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          No Profile Found
        </h2>
        <p className="mt-2 text-gray-600">
          This student hasn't created their profile yet.
        </p>
        {editable && (
          <button
            onClick={() => {
              setEditMode(true);
              setForm({
                name: "",
                email: "",
                enrollmentNo: "",
                branch: "",
                year: 1,
                cgpa: 0,
                resumeUrl: "",
                skills: [],
                isPlaced: false,
              });
            }}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600">
            {editable
              ? editMode
                ? "Fill in the details"
                : "View or edit profile"
              : `Viewing ${profile?.name}'s profile`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin && !editMode && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
            >
              {deleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>{deleting ? "Deleting..." : "Delete Student"}</span>
            </button>
          )}
          {editable && !isAdmin && (
            <>
              {editMode && (
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => (editMode ? handleSave() : setEditMode(true))}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : editMode ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                <span>
                  {saving
                    ? "Saving..."
                    : editMode
                      ? "Save"
                      : profile
                        ? "Edit"
                        : "Create"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <User className="h-4 w-4" />
            <span>Full Name</span>
          </label>
          {editMode ? (
            <input
              name="name"
              type="text"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
            />
          ) : (
            <p className="text-gray-900">{profile?.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </label>
          {editMode ? (
            <input
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
            />
          ) : (
            <p className="text-gray-900">{profile?.email}</p>
          )}
        </div>

        {/* Enrollment No */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span>Enrollment No.</span>
          </label>
          {editMode ? (
            <input
              name="enrollmentNo"
              type="text"
              value={form.enrollmentNo || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter enrollment number"
            />
          ) : (
            <p className="text-gray-900 font-mono">{profile?.enrollmentNo}</p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Branch
          </label>
          {editMode ? (
            <select
              name="branch"
              value={form.branch || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-900">{profile?.branch}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <Calendar className="h-4 w-4" />
            <span>Year</span>
          </label>
          {editMode ? (
            <select
              name="year"
              value={form.year || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  {y} Year
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-900">{profile?.year} Year</p>
          )}
        </div>

        {/* CGPA */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
            <Star className="h-4 w-4" />
            <span>CGPA</span>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter CGPA (0-10)"
            />
          ) : (
            <p className="text-gray-900">{profile?.cgpa}/10</p>
          )}
        </div>

        {/* Skills */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Skills
          </label>
          {editMode ? (
            <textarea
              name="skills"
              rows={2}
              value={Array.isArray(form.skills) ? form.skills.join(", ") : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter skills separated by commas"
            />
          ) : profile?.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No skills added</p>
          )}
        </div>
      </div>

      {/* Resume Section */}
      {editMode && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-8 w-8 text-gray-500" />
            <p className="mt-2 text-gray-700">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : "Drag & drop PDF/DOC here, or click to browse"}
            </p>
          </div>
          {profile?.resumeUrl && (
            <p className="mt-2 text-sm text-gray-600">
              Current resume:{" "}
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Current Resume
              </a>
            </p>
          )}
        </div>
      )}
      {!editMode && profile?.resumeUrl && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume</h3>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Download Resume
          </a>
        </div>
      )}

      {/* Placement Status */}
      {!editMode && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Placement Status
          </h3>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile?.isPlaced
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {profile?.isPlaced ? "Placed" : "Not Placed"}
            </span>
          </div>
        </div>
      )}

      {/* Profile Completion */}
      {editable && !isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Profile Completion
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((profile?.name ? 1 : 0) +
                      (profile?.email ? 1 : 0) +
                      (profile?.enrollmentNo ? 1 : 0) +
                      (profile?.branch ? 1 : 0) +
                      (profile?.year ? 1 : 0) +
                      (profile?.cgpa ? 1 : 0) +
                      (profile?.resumeUrl ? 1 : 0) +
                      (profile?.skills && profile.skills.length > 0 ? 1 : 0)) *
                    12.5
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-blue-800 font-medium">
              {Math.round(
                ((profile?.name ? 1 : 0) +
                  (profile?.email ? 1 : 0) +
                  (profile?.enrollmentNo ? 1 : 0) +
                  (profile?.branch ? 1 : 0) +
                  (profile?.year ? 1 : 0) +
                  (profile?.cgpa ? 1 : 0) +
                  (profile?.resumeUrl ? 1 : 0) +
                  (profile?.skills && profile.skills.length > 0 ? 1 : 0)) *
                  12.5
              )}
              % Complete
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Complete the profile to improve chances of getting hired!
          </p>
        </div>
      )}
    </div>
  );
}

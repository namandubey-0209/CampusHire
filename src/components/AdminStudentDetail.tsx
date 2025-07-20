"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Trash2, User } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  email: string;
  enrollmentNo: string;
  branch: string;
  year: number;
  cgpa: number;
  resumeUrl?: string;
  skills: string[];
  isPlaced: boolean;
  createdAt: string;
}

export default function AdminStudentDetail({ studentId }: { studentId: string }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios.get<{ success: boolean; student: Student }>(`/api/admin/students/${studentId}`)
      .then(res => {
        if (res.data.success) setStudent(res.data.student);
        else setError("Failed to load student");
      })
      .catch(() => setError("Error loading student"))
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleDelete = async () => {
    if (!confirm("Delete this student and all their data?")) return;
    try {
      await axios.delete<{ success: boolean; message?: string }>(`/api/admin/students/${studentId}`);
      router.push("/admin/students");
    } catch (err) {
      setError((err as any).response?.data?.message || "Error deleting student");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{student.name}</h1>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-1 text-red-600 hover:text-red-800"
        >
          <Trash2 /> <span>Delete</span>
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-2">
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Enrollment No.:</strong> {student.enrollmentNo}</p>
        <p><strong>Branch:</strong> {student.branch}</p>
        <p><strong>Year:</strong> {student.year}</p>
        <p><strong>CGPA:</strong> {student.cgpa}</p>
        <p><strong>Skills:</strong> {student.skills.join(", ")}</p>
        <p><strong>Placed:</strong> {student.isPlaced ? "Yes" : "No"}</p>
        <p><strong>Joined:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
        {student.resumeUrl && (
          <p>
            <a href={student.resumeUrl} target="_blank" className="text-blue-600 hover:underline">
              Download Resume
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

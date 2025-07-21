// src/components/AdminStudentsTable.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

export default function AdminStudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios.get<{ success: boolean; students: Student[] }>("/api/students")
      .then(res => {
        if (res.data.success) setStudents(res.data.students);
        else setError("Failed to load students");
      })
      .catch(() => setError("Error loading students"))
      .finally(() => setLoading(false));
  }, []);

  const handleStudentClick = (studentId: string) => {
    router.push(`/admin/student/${studentId}`);
  };

  if (loading) {
    return <div className="text-center py-20">Loading…</div>;
  }
  if (error) {
    return <div className="text-red-600 text-center py-20">{error}</div>;
  }

  return (
  <div className="overflow-auto">
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Name</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Email</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Enrollment</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Branch</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Year</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">CGPA</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Skills</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Placed</th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Joined On</th>
        </tr>
      </thead>
      <tbody>
        {[...students]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((s) => (
            <tr
              key={s._id}
              className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleStudentClick(s._id)}
            >
              <td className="px-4 py-2 text-sm text-gray-700">{s.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.email}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.enrollmentNo}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.branch}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.year}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.cgpa.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.skills.join(", ")}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {s.isPlaced ? "Yes" : "No"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

}

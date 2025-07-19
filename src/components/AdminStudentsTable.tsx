// src/components/AdminStudentsTable.tsx
"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    axios.get<{ success: boolean; students: Student[] }>("/api/students")
      .then(res => {
        if (res.data.success) setStudents(res.data.students);
        else setError("Failed to load students");
      })
      .catch(() => setError("Error loading students"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading…</div>;
  }
  if (error) {
    return <div className="text-red-600 text-center py-20">{error}</div>;
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Enrollment</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Branch</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Year</th>
            <th className="px-4 py-2 text-left text-sm font-medium">CGPA</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Skills</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Placed</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Joined On</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} className="border-t">
              <td className="px-4 py-2 text-sm">{s.name}</td>
              <td className="px-4 py-2 text-sm">{s.email}</td>
              <td className="px-4 py-2 text-sm">{s.enrollmentNo}</td>
              <td className="px-4 py-2 text-sm">{s.branch}</td>
              <td className="px-4 py-2 text-sm">{s.year}</td>
              <td className="px-4 py-2 text-sm">{s.cgpa.toFixed(2)}</td>
              <td className="px-4 py-2 text-sm">{s.skills.join(", ")}</td>
              <td className="px-4 py-2 text-sm">
                {s.isPlaced ? "Yes" : "No"}
              </td>
              <td className="px-4 py-2 text-sm">
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

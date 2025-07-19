// File: src/app/api/students/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StudentProfile from "@/model/StudentProfile";

export async function GET() {
  await dbConnect();
  try {
    // Populate userId to pull in name and email from the User collection
    const students = await StudentProfile.find({})
      .populate("userId", "name email")
      .select("userId enrollmentNo branch year cgpa resumeUrl skills isPlaced createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Map to flatten out the user fields
    const result = students.map((doc: any) => ({
      _id: doc._id,
      name: doc.userId?.name || "",
      email: doc.userId?.email || "",
      enrollmentNo: doc.enrollmentNo,
      branch: doc.branch,
      year: doc.year,
      cgpa: doc.cgpa,
      resumeUrl: doc.resumeUrl,
      skills: doc.skills,
      isPlaced: doc.isPlaced,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({ success: true, students: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

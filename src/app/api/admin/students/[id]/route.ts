// src/app/api/admin/students/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import StudentProfile from "@/model/StudentProfile";
import { Types } from "mongoose";

interface PopulatedStudent {
  _id: Types.ObjectId;
  userId: {
    name: string;
    email: string;
  };
  enrollmentNo: string;
  branch: string;
  year: number;
  cgpa: number;
  resumeUrl?: string;
  skills: string[];
  isPlaced: boolean;
  createdAt: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const studentDoc = await StudentProfile.findById(id)
    .populate<{ userId: { name: string; email: string } }>("userId", "name email")
    .lean<PopulatedStudent>();

  if (!studentDoc) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const result = {
    _id: studentDoc._id.toString(),
    name: studentDoc.userId.name,
    email: studentDoc.userId.email,
    enrollmentNo: studentDoc.enrollmentNo,
    branch: studentDoc.branch,
    year: studentDoc.year,
    cgpa: studentDoc.cgpa,
    resumeUrl: studentDoc.resumeUrl,
    skills: studentDoc.skills,
    isPlaced: studentDoc.isPlaced,
    createdAt: studentDoc.createdAt.toISOString(),
  };

  return NextResponse.json({ success: true, student: result });
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ success: false, message: "Invalid student ID" }, { status: 400 });
  }

  const studentDoc = await StudentProfile.findById(id);
  if (!studentDoc) {
    return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
  }

  await StudentProfile.deleteOne({ _id: id });
  await User.deleteOne({ _id: studentDoc.userId });

  return NextResponse.json({ success: true, message: "Student deleted" });
}

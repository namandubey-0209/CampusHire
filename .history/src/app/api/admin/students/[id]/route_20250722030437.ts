// src/app/api/admin/students/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import StudentProfile from "@/model/StudentProfile";
import { Types } from "mongoose";
import Application from "@/model/Application";
import mongoose from "mongoose";
import Notification from "@/model/Notification";

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
  req: NextRequest,
  context: { params: { id: string }  }
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

  // Validate ID
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid student ID" },
      { status: 400 }
    );
  }

  // Find the student profile
  const studentDoc = await StudentProfile.findById(id);
  if (!studentDoc) {
    return NextResponse.json(
      { success: false, message: "Student not found" },
      { status: 404 }
    );
  }

  const userId = studentDoc.userId;

  await Promise.all([
    Application.deleteMany({ studentId: studentDoc._id }),
    Notification.deleteMany({ recipientId: userId }),
    StudentProfile.deleteOne({ _id: studentDoc._id }),
    User.deleteOne({ _id: userId }),
  ]);

  return NextResponse.json(
    { success: true, message: "Student and all related data deleted" },
    { status: 200 }
  );
}

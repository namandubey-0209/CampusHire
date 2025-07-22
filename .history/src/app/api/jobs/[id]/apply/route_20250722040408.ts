import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";
import Job from "@/model/Job";
import mongoose from "mongoose";
import StudentProfile from "@/model/StudentProfile";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = context.params;

    const studentProfile = await StudentProfile.findOne({
      userId: new mongoose.Types.ObjectId(user._id),
    });

    if (!studentProfile) {
      return NextResponse.json(
        { success: false, message: "Student profile not found" },
        { status: 404 }
      );
    }

    const alreadyApplied = await Application.findOne({
      jobId: id,
      studentId: studentProfile._id,
    });

    if (alreadyApplied) {
      return NextResponse.json(
        { success: false, message: "Already applied" },
        { status: 409 }
      );
    }

    const job = await Job.findById(id);

    if (studentProfile.isPlaced) {
      return NextResponse.json(
        { success: false, message: "You are already placed" },
        { status: 403 }
      );
    }

    if (
      studentProfile.cgpa < job.minCGPA ||
      !job.eligibleBranches.includes(studentProfile.branch)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Your profile does not meet the job requirements",
        },
        { status: 400 }
      );
    }

    const application = await Application.create({
      jobId: id,
      studentId: studentProfile._id,
      status: "applied",
      appliedAt: new Date(),
    });

    await axios.post(`${process.env.NEXTAUTH_URL}/api/notifications`, {
      recipientId: user._id,
      type: "job_applied",
      message: "Your application has been submitted successfully!",
      isRead: false,
    });

    return NextResponse.json({ success: true, application }, { status: 201 });

  } catch (error) {
    console.error("Error applying to job:", error);
    return NextResponse.json(
      { success: false, message: "Error applying to job" },
      { status: 500 }
    );
  }
}

// src/app/api/jobs/[id]/applicants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Job from "@/model/Job";
import Application from "@/model/Application";
import Notification from "@/model/Notification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const job = await Job.findById(id);
  if (!job) {
    return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
  }

  const applicants = await Application.find({ jobId: job._id })
    .populate({
      path: "studentId",
      select: "userId status",
      populate: { path: "userId", select: "name _id" }
    });

  await Promise.all(applicants.map(async app => {
    // Determine message based on status
    const userId = (app.studentId.userId as any)._id;
    let message: string;
    if (app.status === "shortlisted") {
      message = `Congratulations! You have been shortlisted for “${job.title}.”`;
    } else if (app.status === "rejected") {
      message = `We’re sorry—your application for “${job.title}” was not selected.`;
    } else {
      // Skip or send neutral info for other statuses
      return;
    }
    await Notification.create({
      recipientId: userId,
      type: "status_update",
      message,
      link: `/applications/${app._id}`, 
      isRead: false
    });
  }));

  return NextResponse.json({ success: true, applicants }, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";
import StudentProfile from "@/model/StudentProfile";
import Notification from "@/model/Notification";
import Job from "@/model/Job";

export async function POST(request: NextRequest) {
  await dbConnect();

  const { acceptedIds, jobId } = await request.json();

  const job = await Job.findById(jobId).select('title companyName');
  if (!job) {
    return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
  }

  const now = new Date();
  await Job.findByIdAndUpdate(jobId, { lastDateToApply: now });

  const apps = await Application.find({ jobId });

  await Promise.all(apps.map(async (app) => {
    const isAccepted = acceptedIds.includes(app._id.toString());

    app.status = isAccepted ? "shortlisted" : "rejected";
    await app.save();

    const studentProfile = await StudentProfile.findById(app.studentId);
    studentProfile.isPlaced = isAccepted;
    await studentProfile.save();

    const jobInfo = `${job.title} at ${job.companyName}`;
    try {
      await Notification.create({
        recipientId: studentProfile.userId,
        type: "status_update",
        message: isAccepted
          ? `Congratulations! You have been shortlisted for ${jobInfo}.`
          : `We're sorry—your application for ${jobInfo} has been rejected.`,
        isRead: false,
      });
    } catch (error: any) {
      if (error.code !== 11000) {
        console.error('Notification creation failed:', error);
      }
    }
  }));

  return NextResponse.json({ success: true });
}

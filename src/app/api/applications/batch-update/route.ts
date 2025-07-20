// File: src/app/api/applications/batch-update/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";
import StudentProfile from "@/model/StudentProfile";
import Notification from "@/model/Notification";
import Job from "@/model/Job";  // Add Job model import

export async function POST(request: NextRequest) {
  await dbConnect();
  const { acceptedIds, jobId } = await request.json();

  // Fetch the job details to get the job title and company
  const job = await Job.findById(jobId).select('title companyName');
  if (!job) {
    return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
  }

  // Fetch all applications for the job
  const apps = await Application.find({ jobId });

  await Promise.all(apps.map(async app => {
    const isAccepted = acceptedIds.includes(app._id.toString());

    // Use "shortlisted" in place of "accepted" to comply with your enum
    app.status = isAccepted ? "shortlisted" : "rejected";
    await app.save();

    // Update the student's placement flag
    await StudentProfile.findOneAndUpdate(
      { userId: app.studentId },
      { isPlaced: isAccepted },
      { new: true }
    );

    // Create job-specific notification messages
    const jobInfo = `${job.title} at ${job.companyName}`;
    
    // Send a notification with job-specific message
    try {
      await Notification.create({
        recipientId: app.studentId,
        type: "status_update",
        message: isAccepted
          ? `Congratulations! You have been shortlisted for ${jobInfo}.`
          : `We're sorry—your application for ${jobInfo} has been rejected.`,
        isRead: false,
      });
    } catch (error: any) {
      // Handle duplicate key error gracefully
      if (error.code !== 11000) {
        console.error('Notification creation failed:', error);
      }
    }
  }));

  return NextResponse.json({ success: true });
}

// File: src/app/api/applications/batch-update/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";
import StudentProfile from "@/model/StudentProfile";
import Notification from "@/model/Notification";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { acceptedIds, jobId } = await request.json();

  // Fetch all applications for the job
  const apps = await Application.find({ jobId });

  await Promise.all(apps.map(async app => {
    const isAccepted = acceptedIds.includes(app._id.toString());

    // Use "shortlisted" in place of "accepted" to comply with your enum
    app.status = isAccepted ? "shortlisted" : "rejected";
    await app.save();

    // Update the student’s placement flag
    await StudentProfile.findOneAndUpdate(
      { userId: app.studentId },
      { isPlaced: isAccepted },
      { new: true }
    );

    // Send a notification
    await Notification.create({
      recipientId: app.studentId,
      type: "status_update",
      message: isAccepted
        ? "Congratulations! You have been shortlisted."
        : "We’re sorry—your application has been rejected.",
      isRead: false,
    });
  }));

  return NextResponse.json({ success: true });
}

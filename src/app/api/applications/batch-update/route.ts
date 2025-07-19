import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";
import StudentProfile from "@/model/StudentProfile";
import Notification from "@/model/Notification";

export async function POST(req: Request) {
  await dbConnect();
  const { acceptedIds, jobId } = await req.json();

  const apps = await Application.find({ jobId });

  await Promise.all(apps.map(async app => {
    const accepted = acceptedIds.includes(app._id.toString());
    app.status = accepted ? "accepted" : "rejected";
    await app.save();

    await StudentProfile.findOneAndUpdate(
      { userId: app.studentId },
      { isPlaced: accepted },
      { new: true }
    );

    // Send notification
    await Notification.create({
      recipientId: app.studentId,
      type: accepted ? "status_update" : "job_applied",
      message: accepted
        ? "Congratulations! Your application has been accepted."
        : "We’re sorry—your application has been rejected.",
      isRead: false,
    });
  }));

  return NextResponse.json({ success: true });
}

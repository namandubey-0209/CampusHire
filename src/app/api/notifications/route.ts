import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Notification from "@/model/Notification";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Fetching notifications for user:", user._id);

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const notifications = await Notification.find({
      recipientId: user._id,
      createdAt: { $gte: oneMonthAgo }, // Only notifications created >= 30 days ago
    }).sort({ createdAt: -1 });

    return Response.json(
      { success: true, notifications: notifications || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json(
      { success: false, message: "Error fetching notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { recipientId, type, message, isRead = false } = await req.json();
    const notification = await Notification.create({
      recipientId,
      type,
      message,
      isRead,
    });
    return NextResponse.json({ success: true, notification });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({
        success: true,
        message: "Duplicate notification prevented",
      });
    }
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, message: "Error creating notification" },
      { status: 500 }
    );
  }
}

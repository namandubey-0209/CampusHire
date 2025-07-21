import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/model/Notification";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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
    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    // Optional but recommended: verify ownership
    if (notification.recipientId.toString() !== user._id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (notification.isRead) {
      return NextResponse.json(
        { success: false, message: "Notification already read" },
        { status: 400 }
      );
    }

    notification.isRead = true;
    await notification.save();

    return NextResponse.json({ success: true, notification }, { status: 200 });
  } catch (error) {
    console.error("Error reading notification:", error);
    return NextResponse.json(
      { success: false, message: "Error reading notification" },
      { status: 500 }
    );
  }
}

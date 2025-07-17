import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/model/Notification";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const notifications = await Notification.find({ recipientId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!notifications) {
      return Response.json({ success: false, message: "No notifications found" }, { status: 404 });
    }

    return Response.json({ success: true, notifications }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json(
      { success: false, message: "Error fetching notifications" },
      { status: 500 }
    );
  }
}

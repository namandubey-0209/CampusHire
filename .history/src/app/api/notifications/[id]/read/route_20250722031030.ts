import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/model/Notification";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string }  }
) {
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

    const { id } = await params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return Response.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.isRead) {
      return Response.json(
        { success: false, message: "Notification already read" },
        { status: 400 }
      );
    }

    notification.isRead = true;
    await notification.save();

    return Response.json({ success: true, notification }, { status: 200 });

  } catch (error) {
    console.error("Error reading notification:", error);
    return Response.json(
      { success: false, message: "Error reading notification" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/model/Notification";
im
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string }  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { id } = await params;
    const result = await Notification.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ success: false, message: "Error deleting notification" }, { status: 500 });
  }
}

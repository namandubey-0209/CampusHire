import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import StudentProfile from "@/model/StudentProfile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = context.params;

    const studentProfile = await StudentProfile.findOne({ userId: id });
    if (!studentProfile) {
      return NextResponse.json(
        { success: false, message: "Student has not created a profile yet." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Fetched student profile", studentProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting student profile", error);
    return NextResponse.json(
      { success: false, message: "Error getting student profile" },
      { status: 500 }
    );
  }
}

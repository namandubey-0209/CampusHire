import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";
import mongoose from "mongoose";
import StudentProfile from "@/model/StudentProfile";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
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

    const { id } = params;

    const studentProfile = await StudentProfile.findOne({
      userId: new mongoose.Types.ObjectId(user._id),
    });

    if (!studentProfile) {
      return Response.json(
        { success: false, message: "Student profile not found" },
        { status: 404 }
      );
    }

    const alreadyApplied = await Application.findOne({
      jobId: id,
      studentId: studentProfile._id,
    });

    if (alreadyApplied) {
      return Response.json(
        { success: false, message: "Already applied" },
        { status: 409 }
      );
    }

    const application = await Application.create({
      jobId: id,
      studentId: studentProfile._id,
      status: "applied",
      appliedAt: new Date(),
    });

    return Response.json({ success: true, application }, { status: 201 });

  } catch (error) {
    console.error("Error applying to job:", error);
    return Response.json(
      { success: false, message: "Error applying to job" },
      { status: 500 }
    );
  }
}

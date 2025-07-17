import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";
import StudentProfile from "@/model/StudentProfile";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const studentProfile = await StudentProfile.findOne({ userId: user._id });
    if (!studentProfile) {
      return Response.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    const applications = await Application.find({ studentId: studentProfile._id })
      .populate({
        path: "jobId",
        select: "title companyName companyId mode"
      });

    return Response.json({ success: true, applications }, { status: 200 });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return Response.json(
      { success: false, message: "Error fetching applications" },
      { status: 500 }
    );
  }
}

/*
Example Response:
{
  success: true,
  applications: [
    {
      _id: "application_id_1",
      jobId: {
        _id: "job_id_1",
        title: "Frontend Developer Intern",
        companyName: "Tech Corp",
        companyId: "company_id_1",
        mode: "remote"
      },
      studentId: "student_profile_id",
      createdAt: "2025-07-17T12:00:00.000Z",
      updatedAt: "2025-07-17T12:00:00.000Z"
    },
    ...
  ]
}
*/

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Job from "@/model/Job";
import Application from "@/model/Application";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    const job = await Job.findById(id);

    if (!job) {
      return Response.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    const applicants = await Application.find({ jobId: job._id })
      .populate({
        path: "studentId",
        select: "userId", 
        populate: {
          path: "userId",
          select: "name _id", 
        },
      });

    return Response.json({ success: true, applicants }, { status: 200 });

  } catch (error) {
    console.error("Error fetching applicants:", error);
    return Response.json(
      { success: false, message: "Error fetching applicants" },
      { status: 500 }
    );
  }
}

/*
data -> 

{
  "_id": "application_id",
  "jobId": "...",
  "studentId": {
    "_id": "student_profile_id",
    "userId": {
      "_id": "user_id",
      "name": "Student Name"
    }
  }
}
*/

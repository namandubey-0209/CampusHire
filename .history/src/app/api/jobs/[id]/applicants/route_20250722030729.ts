// src/app/api/jobs/[id]/applicants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Job from "@/model/Job";
import Application from "@/model/Application";

export async function GET(
  req: NextRequest,
  context: { params: { id: string }  }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { id } =  context.params;
  const job = await Job.findById(id);
  if (!job) {
    return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
  }

  const applicants = await Application.find({ jobId: job._id })
    .populate({
      path: "studentId",
      select: "userId status",
      populate: { path: "userId", select: "name _id" }
    });

  return NextResponse.json({ success: true, applicants }, { status: 200 });
}

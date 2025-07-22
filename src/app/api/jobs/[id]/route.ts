import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { Types } from "mongoose";
import Job from "@/model/Job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const { id } = (await context.params);
    const job = await Job.findById(id).populate("postedBy", "_id name");

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Got job", job: job },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error getting job", error);
    return NextResponse.json(
      { success: false, message: "Error getting job" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = (await context.params);
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Job ID" },
        { status: 400 }
      );
    }

    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    existingJob.title = body.title ?? existingJob.title;
    existingJob.companyName = body.companyName ?? existingJob.companyName;
    existingJob.location = body.location ?? existingJob.location;
    existingJob.description = body.description ?? existingJob.description;
    existingJob.mode = body.mode ?? existingJob.mode;
    existingJob.minCGPA = body.minCGPA ?? existingJob.minCGPA;
    existingJob.eligibleBranches = body.eligibleBranches ?? existingJob.eligibleBranches;
    existingJob.lastDateToApply = body.lastDateToApply
      ? new Date(body.lastDateToApply)
      : existingJob.lastDateToApply;

    await existingJob.save();

    return NextResponse.json(
      { success: true, message: "Updated job", job: existingJob },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating job", error);
    return NextResponse.json(
      { success: false, message: "Error updating job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = (await context.params);

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Job ID" },
        { status: 400 }
      );
    }

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    await Job.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job", error);
    return NextResponse.json(
      { success: false, message: "Error deleting job" },
      { status: 500 }
    );
  }
}

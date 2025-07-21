import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Job from "@/model/Job";
import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";

export async function GET(req: Request) {
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

    const jobs = await Job.find().populate("postedBy", "_id name");

    return NextResponse.json(
      {
        success: true,
        jobs: jobs || [],
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error getting jobs", error);
    return NextResponse.json(
      { success: false, message: "Error getting jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const {
      title,
      companyName,
      companyId,
      description,
      mode,
      location,
      minCGPA,
      eligibleBranches,
      lastDateToApply,
    } = await req.json();

    const postedBy = new Types.ObjectId(user._id);

    if (
      !title ||
      !companyName ||
      !postedBy ||
      !companyId ||
      !description ||
      !mode ||
      !location ||
      !minCGPA ||
      !eligibleBranches ||
      !lastDateToApply
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await Job.create({
      title,
      companyName,
      postedBy,
      companyId,
      description,
      mode,
      location,
      minCGPA,
      eligibleBranches,
      lastDateToApply,
    });

    return NextResponse.json(
      { success: true, message: "Job created", job },
      { status: 200 }
    );

  } catch (error) {
    console.error("Job creation error", error);
    return NextResponse.json(
      { success: false, message: "Error creating job" },
      { status: 500 }
    );
  }
}

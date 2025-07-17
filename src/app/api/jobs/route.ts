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
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }

    const jobs = await Job.find().populate("postedBy", "_id name");
    if (!jobs || jobs.length === 0) {
      return Response.json(
        { success: false, message: "Jobs not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Fetched jobs", jobs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting jobs", error);
    return Response.json(
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
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    const { title, companyName, companyId, description, mode, location, minCGPA, eligibleBranches, lastDateToApply } =
      await req.json();
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

    return Response.json(
      { success: true, message: "Job created", job },
      { status: 200 }
    );

  } catch (error) {
    console.error("Job creation error", error);
    return Response.json(
      { success: false, message: "Error creating job" },
      { status: 500 }
    );
  }
}



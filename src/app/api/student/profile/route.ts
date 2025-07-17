import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import StudentProfile from "@/model/StudentProfile";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

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

    const studentProfile = await StudentProfile.findOne({ userId: user._id });
    if (!studentProfile) {
      return Response.json(
        { success: false, message: "Student profile not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Fetched student profile", studentProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting student profile", error);
    return Response.json(
      { success: false, message: "Error getting student profile" },
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

    const { enrollmentNo, branch, year, cgpa, resumeLink, skills, isPlaced } =
      await req.json();
    const userId = new Types.ObjectId(user._id);

    if (
      !enrollmentNo ||
      !branch ||
      !year ||
      !cgpa ||
      !resumeLink ||
      !skills ||
      !isPlaced
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const studentProfile = await StudentProfile.create({
      userId,
      enrollmentNo,
      branch,
      year,
      cgpa,
      resumeLink,
      skills,
      isPlaced
    });

    return Response.json(
      { success: true, message: "Student Profile created", studentProfile },
      { status: 200 }
    );

  } catch (error) {
    console.error("Student profile creation error", error);
    return Response.json(
      { success: false, message: "Error creating student profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
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

    const existingProfile = await StudentProfile.findOne({ userId: user._id });
    if (!existingProfile) {
      return Response.json(
        { success: false, message: "Student profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    existingProfile.enrollmentNo = body.enrollmentNo ?? existingProfile.enrollmentNo;
    existingProfile.branch = body.branch ?? existingProfile.branch;
    existingProfile.year = body.year ?? existingProfile.year;
    existingProfile.cgpa = body.cgpa ?? existingProfile.cgpa;
    existingProfile.resumeLink = body.resumeLink ?? existingProfile.resumeLink;
    existingProfile.skills = body.skills ?? existingProfile.skills;
    existingProfile.isPlaced = body.isPlaced ?? existingProfile.isPlaced;

    await existingProfile.save();

    return Response.json(
      { success: true, message: "Student profile updated", studentProfile: existingProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student profile", error);
    return Response.json(
      { success: false, message: "Error updating student profile" },
      { status: 500 }
    );
  }
}


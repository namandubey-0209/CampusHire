import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StudentProfile from "@/model/StudentProfile";

export async function GET() {
  await dbConnect();
  try {
    const count = await StudentProfile.countDocuments({});
    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students count:", error);
    return NextResponse.json({ success: false, count: 0 }, { status: 500 });
  }
}

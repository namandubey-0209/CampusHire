import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Application from "@/model/Application";

export async function GET() {
  await dbConnect();
  try {
    const count = await Application.countDocuments({});
    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications count:", error);
    return NextResponse.json({ success: false, count: 0 }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import CompanyProfile from "@/model/CompanyProfile";

export async function GET() {
  try {
    await dbConnect();
    const companies = await CompanyProfile.find({}).select("_id name description website location logoUrl");
    return NextResponse.json({ success: true, companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const company = await CompanyProfile.create({
      ...body,
      createdBy: session.user._id
    });

    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ success: false, message: "Failed to create company" }, { status: 500 });
  }
}

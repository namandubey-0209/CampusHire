// File: src/app/api/company/[id]/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Job from "@/model/Job";

export async function GET(
  req: NextRequest,
  context: { params: { id: string }  }
) {
  await dbConnect();
  
  try {
    const { id } =  context.params;
    const jobs = await Job.find({ companyId: id })
      .select("title companyName companyId mode")
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    return NextResponse.json({ success: false, jobs: [] }, { status: 500 });
  }
}

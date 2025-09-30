// src/app/api/admin/dashboard-stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Job from "@/model/Job";
import CompanyProfile from "@/model/CompanyProfile";
import StudentProfile from "@/model/StudentProfile";
import Application from "@/model/Application";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const today = new Date();

    const [
      activeJobsCount,
      companiesCount,
      studentsCount,
      applicationsCount
    ] = await Promise.all([
      Job.countDocuments({
        lastDateToApply: { $gte: today },
      }),
      
      CompanyProfile.countDocuments(),
      
      StudentProfile.countDocuments(),
      
      Application.countDocuments({
        status: { $in: ["applied"] }
      })
    ]);

    const stats = {
      jobs: activeJobsCount,
      companies: companiesCount,
      students: studentsCount,
      applications: applicationsCount
    };

    return NextResponse.json(
      { success: true, stats },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' 
        }
      }
    );

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

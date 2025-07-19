import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import CompanyProfile from "@/model/CompanyProfile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    try {

        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if(!session || !user){
            return new Response(
                JSON.stringify({ success: false, message: "Not authenticated" }),
                { status: 401 }
            );
        }

        const { id } = await params;

        const companyProfile = await CompanyProfile.findById(id);
        if (!companyProfile) {
            return Response.json(
                { success: false, message: "Company profile not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "Fetched company profile", companyProfile },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Error getting company profile", error);
        return Response.json(
            { success: false, message: "Error getting company profile" },
            { status: 500 }
        );
    }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { companyId } = await params;

    await CompanyProfile.findByIdAndDelete(companyId);

    return NextResponse.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ success: false, message: "Failed to delete company" }, { status: 500 });
  }
}

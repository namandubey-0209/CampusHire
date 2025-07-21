import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import CompanyProfile from "@/model/CompanyProfile";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/model/Job";

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

    const companyProfile = await CompanyProfile.findById(id);
    if (!companyProfile) {
      return NextResponse.json(
        { success: false, message: "Company profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Fetched company profile", companyProfile },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error getting company profile", error);
    return NextResponse.json(
      { success: false, message: "Error getting company profile" },
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
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = (await context.params);
    const body = await req.json();

    const existingCompany = await CompanyProfile.findById(id);
    if (!existingCompany) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const oldName = existingCompany.name;

    existingCompany.name = body.name ?? existingCompany.name;
    existingCompany.description = body.description ?? existingCompany.description;
    existingCompany.website = body.website ?? existingCompany.website;
    existingCompany.location = body.location ?? existingCompany.location;
    existingCompany.logoUrl = body.logoUrl ?? existingCompany.logoUrl;

    await existingCompany.save();

    if (body.name && body.name !== oldName) {
      await Job.updateMany(
        { companyId: existingCompany._id },
        { $set: { companyName: existingCompany.name } }
      );
    }

    return NextResponse.json(
      { success: true, company: existingCompany },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { success: false, message: "Error updating company" },
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
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = (await context.params);

    await Job.deleteMany({ companyId: id });
    await CompanyProfile.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Company and its jobs deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete company" },
      { status: 500 }
    );
  }
}

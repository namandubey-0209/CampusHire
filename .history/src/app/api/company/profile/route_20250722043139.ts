import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import CompanyProfile from "@/model/CompanyProfile";

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
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { name, description, website, location, logoUrl } = await req.json();

    if (!name || !description || !website || !location || !logoUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const companyProfile = await CompanyProfile.create({
      name,
      description,
      website,
      location,
      logoUrl
    });

    if (!companyProfile) {
      return NextResponse.json(
        { success: false, message: "Error creating company profile" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Company Profile created", companyProfile },
      { status: 200 }
    );

  } catch (error) {
    console.error("Company profile creation error", error);
    return NextResponse.json(
      { success: false, message: "Error creating company profile" },
      { status: 500 }
    );
  }
}

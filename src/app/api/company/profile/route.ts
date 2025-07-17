import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import CompanyProfile from "@/model/CompanyProfile";

// export async function GET(req: Request) {
//   await dbConnect();

//   try {
//     const session = await getServerSession(authOptions);
//     const user: User = session?.user as User;

//     if (!session || !user) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Not authenticated" }),
//         { status: 401 }
//       );
//     }

//     const { id } = await req.json();

//     const companyProfile = await CompanyProfile.findById(id);
//     if (!companyProfile) {
//       return Response.json(
//         { success: false, message: "Company profile not found" },
//         { status: 404 }
//       );
//     }

//     return Response.json(
//       { success: true, message: "Fetched company profile", companyProfile },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error getting company profile", error);
//     return Response.json(
//       { success: false, message: "Error getting company profile" },
//       { status: 500 }
//     );
//   }
// }

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

    if(user.role !== "admin"){
        return NextResponse.json(
          { success: false, message: "Forbidden" },
          { status: 403 }
        );
    }

    const { name, description, website, location, logoUrl } =
      await req.json();

    if (
      !name ||
      !description ||
      !website ||
      !location ||
      !logoUrl
    ) {
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

    return Response.json(
      { success: true, message: "Company Profile created", companyProfile },
      { status: 200 }
    );

  } catch (error) {
    console.error("Company profile creation error", error);
    return Response.json(
      { success: false, message: "Error creating company profile" },
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

    if(user.role !== "admin"){
        return NextResponse.json(
          { success: false, message: "Forbidden" },
          { status: 403 }
        );
    }

    const body = await req.json();

    const existingProfile = await CompanyProfile.findById(body.id);
    if (!existingProfile) {
      return Response.json(
        { success: false, message: "Company profile not found" },
        { status: 404 }
      );
    }

    existingProfile.name = body.name ?? existingProfile.name;
    existingProfile.description = body.description ?? existingProfile.description;
    existingProfile.website = body.website ?? existingProfile.website;
    existingProfile.location = body.location ?? existingProfile.location;
    existingProfile.logoUrl = body.logoUrl ?? existingProfile.logoUrl;

    await existingProfile.save();

    return Response.json(
      { success: true, message: "Company profile updated", companyProfile: existingProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company profile", error);
    return Response.json(
      { success: false, message: "Error updating company profile" },
      { status: 500 }
    );
  }
}


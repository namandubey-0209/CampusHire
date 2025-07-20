import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import StudentProfile from "@/model/StudentProfile";
import { NextRequest } from "next/server";

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

        const studentProfile = await StudentProfile.findOne({ userId: id });
        if (!studentProfile) {
            return Response.json(
                { success: false, message: "Student has not created a profile yet." },
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
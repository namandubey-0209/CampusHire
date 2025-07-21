import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import dbConnect from "@/lib/dbConnect";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = (await context.params);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file received" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${id}_${Date.now()}_${file.name}`;
    const resumesDir = path.join(process.cwd(), "public", "resumes");
    const filepath = path.join(resumesDir, filename);

    try {
      await mkdir(resumesDir, { recursive: true });
    } catch (error) {
      console.log("Directory already exists or creation failed:", error);
    }

    await writeFile(filepath, buffer);

    const resumeUrl = `/resumes/${filename}`;

    return NextResponse.json({ success: true, resumeUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}

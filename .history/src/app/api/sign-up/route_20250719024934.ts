import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";

//OAuth yet to be handled

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, password, role } = await request.json();

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return new Response(
        JSON.stringify({ success: false, message: "User exists with this email" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      forgotPassCode: null,
      forgotPassCodeExpiry: null,
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ success: true, message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up:", error);
    return new Response(
      JSON.stringify({ message: "Error signing up", success: false }),
      { status: 500 }
    );
  }
}

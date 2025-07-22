import { sendForgotPassEmail } from "@/helpers/sendForgotPassEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();
    console.log("1. Received email request for:", email);
    
    const user = await UserModel.findOne({ email: email });
    console.log("2. User found:", user ? "YES" : "NO");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.forgotPassCodeExpiry && user.forgotPassCodeExpiry > new Date()) {
      console.log("3. OTP already active, blocking request");
      return NextResponse.json(
        { success: false, message: "OTP already sent. Please check your email or wait before requesting again." },
        { status: 400 }
      );
    }

    // Generate new OTP
    let otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("4. Generated OTP:", otpCode);

    // Update user with new OTP and expiry (5 minutes from now)
    user.forgotPassCode = otpCode;
    user.forgotPassCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    console.log("5. User updated in database");

    const username = user.name;
    console.log("6. About to call sendForgotPassEmail...");

    // Send email
    const emailResponse = await sendForgotPassEmail(
      email,
      username,
      otpCode
    );
    
    console.log("7. Email response:", emailResponse);
    
    if (!emailResponse.success) {
      console.log("8. Email sending failed:", emailResponse.message);
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    console.log("9. Email sent successfully");
    return NextResponse.json(
      {
        success: true,
        message: 'OTP successfully sent. Check your email inbox',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json(
      { success: false, message: "Error sending OTP" },
      { status: 500 }
    );
  }
}

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextResponse } from 'next/server'; // Adjust the import based on your setup

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });

        // Validate if user exists
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Validate code and expiration
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return NextResponse.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 });
        }

        // Code is invalid or expired
        const errorMessage = !isCodeValid ? "Incorrect Verification code" : "Verification code is expired";

        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: 400 });

    } catch (error) {
        console.error("Error Verifying user", error);
        return NextResponse.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 });
    }
}

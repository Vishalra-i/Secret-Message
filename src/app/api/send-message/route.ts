import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content }: { username: string, content: string } = await request.json();

    try {
        if (!username || username.length <= 0 || !content || content.length <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username and content are required"
                },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ username });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        // Is user accepting a message 
        if (!user.isAcceptingMessage) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                { status: 403 }
            );
        }

        const newMessage = 
        { 
            Content : content, 
            createdAt: new Date() 
        };
        user.messages.push(newMessage as Message);
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            { status: 200 }
        );

    } catch (error:any) {
        console.error("An unexpected error:", error);

        return NextResponse.json(
            {
                success: false,
                message: `Internal Server issue: ${error?.message}`
            },
            { status: 500 }
        );
    }
}

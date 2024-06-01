import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {Message} from "@/model/User.model"

export async function POST(request : Request) {
    await dbConnect()
    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if (!user) {
           return Response.json(
                {
                    success: false,
                    message: "User not found"
                },{ status: 404 }
            )
        }

        //is user accepting a message 
        if (!user.isAcceptingMessage) {
            return Response.json(
                {   
                    success: false,
                    message: "User is not accepting message"
                },{ status: 403 }
            )
        }

        const newMessage = {content , createdAt : new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
    }catch (error) {
        console.log("An unexpected error:: ",error)

        return Response.json(
            {
                success : false ,
                message : 'Internal Server issue'
            },{
                status : 500
            }
        )
    }
    
}
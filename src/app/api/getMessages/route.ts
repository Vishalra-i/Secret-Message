import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth"; 
import mongoose, { mongo } from "mongoose";

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session.user) {
      return Response.json(
          {
              success : false ,
              message : 'Not Authenticated'
          },{
              status : 401
          }
      )
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
        {$match : {_id : userId}},
        {$unwind : '$messages'},
        {$sort : {'messages.CreatedAt' : -1}},
        {$group : {_id : '$_id' , messages : {$push : '$messages'}}}
        ])

        if(!user || user.length === 0){
           return Response.json(
               {
                   success : true ,
                   message : 'No messages'
               },{
                   status : 200
               }
           ) 
        }

        return Response.json({
            success : true ,
            messages : user[0].messages
        })

    } catch (error) {
        console.log("An unexpected error:: ",error)

        return Response.json(
            {
                success : false ,
                message : 'Not Authenticate'
            },{
                status : 500
            }
        )
    }
}
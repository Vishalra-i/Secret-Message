import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth"; 


export async function DELETE(request: Request , {params}:{params : {messageId : string}}) {
    const {messageId} = params
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

    try{
        const updateResult =  await UserModel.updateOne(
            {id : user?._id},
            {$pull : {messages : {_id : messageId}}}
        )

        if(updateResult.modifiedCount === 0){
            return Response.json(
                {
                    success : false ,
                    message : 'Message not found or already deleted'
                },{
                    status : 404
                }
            )
        }

        return Response.json(
            {
                success : true ,
                message : 'Message deleted'
            },{
                status : 200
            }
        )

    } catch (error) {
        console.log("An unexpected error in delete message route :: ",error)

        return Response.json(
            {
                success : false ,
                message : 'Error deleting message'
            },{
                status : 500
            }
        )
    }
    }

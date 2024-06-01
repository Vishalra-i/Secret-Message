import dbConnect from "@/lib/dbConnect"
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema"
import UserModel from "@/model/User.model"
import { use } from "react"


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get("username")
        }
       
        //Validaation with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result) //REmove
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                message : "Invalid username",
                success : false
            },{
                status : 400
            })
        }

        const {username}= result.data

        const existingVerifiedUsername = await UserModel.findOne({
            username ,
            // isVerified : true
        })


        if(existingVerifiedUsername){
            return Response.json({
                message : "Username is already taken",
                success : false
            },{
                status : 400
            })
        }

        return Response.json({
            message : "Username is Available",
            success : true
        },{
            status : 200
        })

        
        
    } catch (error) {
        console.error("Error checking username ::" , error)
        return  Response.json({
            message : `Error checking Username :: ${error}`,
            sucess : false,
        },{
            status : 500
        })
    }
}
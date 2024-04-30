import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request:Request ) {
    await dbConnect()

    try {
        const {username , email , password} = await request.json()

        //Validate username already taken or not 
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username ,
            isVerified : true 
        })

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success : false,
                message : 'Username already exists'
            },{
                status : 400
            })
        }

        //Validate existed user by email
        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail) {
            return Response.json({
                success : false,
                message : 'Email already exists'
            },{
                status : 400
            })
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date.now()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username , 
                email , 
                password : hashedPassword , 
                verifyCode ,
                verifyCodeExpiry : expiryDate,
            })

            await newUser.save()
        }

        //send Verification email
        const emailResponse = await sendVerificationEmail(
            username ,
            email,
            verifyCode
        )

        if(!emailResponse.success) {
            return Response.json({
                success : false,
                message : emailResponse.message
            },{
                status : 400
            })
        }




    } catch (error) {
        console.log('Error registering user',error)
        return Response.json({
            success: false,
            message: 'Error registering user'
        },{
            status : 500
        })
    }
}
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
            if (existingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : 'Email already exists'
                },{
                    status : 400
                })
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            let expiryDate = new Date()

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

        const emailType = "Verify" ;
        //send Verification email
        const emailResponse = await sendVerificationEmail(
            username ,
            email,
            verifyCode ,
            emailType
        )

        if(!emailResponse.success) {
            return Response.json({
                success : false,
                message : emailResponse.message
            },{
                status : 400
            })
        }

       //Success return 
        return Response.json({
            success : true ,
            message : 'User registered successfully . Please verify your email' 
        },{
            status : 200 ,
        })

    } catch (error:any) {
        console.log('Error registering user',error)
        return Response.json({
            success: false,
            message: `Error registering user :: ${error.message}`
        },{
            status : 500
        })
    }
}
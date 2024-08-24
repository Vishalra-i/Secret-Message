import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request ) {
  await dbConnect()
  try {
          const { email } = await request.json()
  
          //Validate username already taken or not 
          const existingUserVerifiedByUsername = await UserModel.findOne({
              email ,
              isVerified: true
          });
  
          if(!existingUserVerifiedByUsername) {
              return Response.json({
                  success : false ,
                  message : "User not found"
              },{
                  status : 404
              })
          }
  
          const verifyCode = Math.floor(100000 + Math.random() * 900000).toString() ;
          //Update verification code
          existingUserVerifiedByUsername.forgotPasswordCode = verifyCode ;
          existingUserVerifiedByUsername.forgotPasswordCodeExpiry = new Date(Date.now() + 5 * 60 * 1000) ;

          await existingUserVerifiedByUsername.save() ;

          const emailType = "Password" ;
          //send Verification email
          const emailResponse = await sendVerificationEmail(
              existingUserVerifiedByUsername.username ,
              existingUserVerifiedByUsername.email ,
              verifyCode,
              emailType
          )   
          if(!emailResponse.success) {
              return Response.json({
                  success : false,
                  message : emailResponse.message || "Something went wrong while sending verification code"
              },{
                  status : 400
              })
          }
          //Success return 
          return Response.json({
              success : true ,
              message : 'Verification code sent successfully , check your email for link' 
          },{
              status : 200 ,
          })
  } catch (error:any) {
    console.log('Error in forgot password',error)
    return Response.json({
        success: false,
        message: `Error in forgot password:: ${error?.message}`
    },{
        status : 500
    })
  }

};
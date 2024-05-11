import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    username : string,
    email: string,
    verifyCode: string
) : Promise<ApiResponse>  {
    try {
        console.log( email)
       
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification code Secret message',
            react: VerificationEmail({username,otp:verifyCode}) ,
        })
        console.log("Email sent :: ", data)
        return {
            success: true,
            message: "Verification email sent",
        }
    } catch (emailError:any ) {
        console.log("Error sending verification email :: " , emailError)
        return {
            success: false,
            message: "Error sending verification email",
        }
    }
}

import { transporter } from "@/lib/resend"
import { ApiResponse } from "@/types/ApiResponse"
import { render } from '@react-email/render';
import VerificationEmail from "../../emails/verificationEmail";
import PasswordResetEmail from "../../emails/ForgotPassword";


export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string,
  emailType: 'Verify' | 'Password' ,
): Promise<ApiResponse> {
  try {
    let subject, emailTemplate;
    if (emailType === 'Verify') {
      subject = 'Verification code Secret message';
      emailTemplate = VerificationEmail;
    } else if (emailType === 'Password') {
      subject = 'Reset Password code Secret message';
      emailTemplate = PasswordResetEmail ; 
    } else {
      return {
        success: false,
        message: "Invalid email type",
      };
    }

    const data = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject,
      html: render(emailTemplate({ username, verifyCode })),
    });

    console.log("Email sent :: ", data)
    return {
      success: true,
      message: `Email sent for ${emailType}`, // More specific message
    };

  } catch (emailError: any) {
    if(emailType !== 'Verify' && emailType !== 'Password'){
      console.log('Type of email is invalid')
    }else {
      console.log("Error sending verification email :: ", emailError)
    }
    return {
      success: false,
      message: `Error sending ${emailType} email`,
    };
  }
}
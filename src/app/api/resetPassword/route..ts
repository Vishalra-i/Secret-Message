import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST (request: Request) {
   await dbConnect();
   console.log("hi")
   try {
      const { email, verifyCode, password } = await request.json();

      if (!email) {
         return new Response(
            JSON.stringify({
               success: false,
               message: "Email is required"
            }),
            {
               status: 400,
               headers: { "Content-Type": "application/json" }
            }
         );
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
         return new Response(
            JSON.stringify({
               success: false,
               message: "User not found"
            }),
            {
               status: 404,
               headers: { "Content-Type": "application/json" }
            }
         );
      }

      if (user.forgotPasswordCode !== verifyCode || user.forgotPasswordCodeExpiry < new Date()) {
         return new Response(
            JSON.stringify({ success: false, message: "Invalid or expired verification code" }),
            {
               status: 400,
               headers: { "Content-Type": "application/json" }
            }
         );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.forgotPasswordCode = undefined;
      await user.save();

      return new Response(
         JSON.stringify({
            success: true,
            message: "Password reset successfully"
         }),
         {
            status: 200,
            headers: { "Content-Type": "application/json" }
         }
      );
   } catch (error: any) {
      console.error("Error in reset password:", error);
      return new Response(
         JSON.stringify({
            success: false,
            message: "Error in reset password, please try again later"
         }),
         {
            status: 500,
            headers: { "Content-Type": "application/json" }
         }
      );
   }
}

import {z}  from 'zod' ;

export const forgotPasswordSchema = z.object({
    email : z.string().email('Invalid email') ,
})

export const resetPasswordSchema = z.object({
    email : z.string().email('Invalid email') ,
    otp : z.string().length(6, 'OTP must be 6 digits') ,
    password : z.string().min(8, 'Password must be at least 8 characters') ,
})
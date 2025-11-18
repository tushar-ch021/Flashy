import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
    service:"Gmail",
    port:465,
    secure: 'true',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});
export const sendMail=async(to, otp)=>{
  await  transporter.sendMail({
        from:`${process.env.EMAIL}`,
        to,
        subject:"OTP Verification ",
        html:`
            <h1>Your OTP is ${otp} for reset your Flashy password </h1></br>
            <p>It will expire in 5 minutes.</p>
        `
    })
}
export default transporter;

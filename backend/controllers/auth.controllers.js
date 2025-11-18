import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import { sendMail } from "../config/mail.js";
export const signUp=async(req,res)=>{
    try {
        const {name,userName,email,password}=req.body;
        const findByEmail=await User.findOne({email});
        if(findByEmail){
            return res.status(400).json({
                success:false,
                message:"User already exists !"
            });
        }
        const findByUserName=await User.findOne({userName});
        if(findByUserName){
            return res.status(400).json({
                success:false,
                message:"Username already exists !"
            });
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters long !"
            });
        }
        const hashedPassword= await bcrypt.hash(password,10);

        const user=await User.create({name,userName,email,password:hashedPassword});
        const token= await genToken(user._id);
        res.cookie("token",token,{httpOnly:true,maxAge:1*365*24*60*60*1000,secure:false,sameSite:'Strict'});
        return res.status(201).json({
            success:true,
            message:"User created successfully",
            user,
            token
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}


export const signIn=async(req,res)=>{
    try {
        const {userName,password}=req.body;
        const user=await User.findOne({userName});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found !"
            });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid password !"
            });
        }
       
        const token= await genToken(user._id);
        res.cookie("token",token,{httpOnly:true,maxAge:1*365*24*60*60*1000,secure:false,sameSite:'Strict'});
        return res.status(201).json({
            success:true,
            message:"User signIn successfully",
            user,
            token
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

export const signOut=async(req,res)=>{
    try {
        res.clearCookie("token");
    return res.status(200).json({
        success:true,
        message:"User signed out successfully"
    });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}   
// otp create and send
export const sendOtp=async(req,res)=>{
try {
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found !"
        });
    }
    const otp=Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp=otp,
    user.otpExpires= Date.now()+5*60*1000;
    user.isOtpVerified=false
    await user.save()
    await sendMail(email,otp);
    return res.status(200).json({
        success:true,
        message:"OTP sent to email",
        otp
    });
} catch (error) {
    return res.status(500).json({
        success:false,
        message:error.message
    });
}
}
// otp verify
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetOtp ||
      !user.otpExpires ||
      user.resetOtp.toString() !== otp.toString() ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user || user.isOtpVerified===false){
            return res.status(400).json({
                success:false,
                message:"OTP not verified !"
            });
        }
        user.password=await bcrypt.hash(password,10);
        user.isOtpVerified=false
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}